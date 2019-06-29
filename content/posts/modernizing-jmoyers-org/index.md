---
title: 'Automating and Modernizing My Site'
date: '2019-06-28'
---

Recently I set out to replace the infrastructure behind my personal website.

I had a few goals when I started the project a few days back...

- I want to write articles in vim, press a button and have them show up on the
  internet.
- I want to control the build pipeline - I want minified html, css (written in
  sass), and javascript. I don't want to be forced into using javascript, even
  though I'm deeply invested in React!
- I don't want to write a blog server from scratch. Thats a solved problem.
- I want nice TLS, but I don't want to store the certs unecryped on disk, and I
  don't want to store them in a docker image.
- I want to manage this all through private ssh keys as opposed to usernames and
  passwords.
- I want the infrastructure to be as mutable as the source of the blog itself,
  and I want to be able to switch cloud providers instantly.
- I want everything to be containerized and using some kind of orchestration
  service to keep the processing running, the logs flowing, and the service
  updates smooth.

And also some anti-goals...

- No databases
- No user administration
- Not expensive (can run on one small instance)
- No javascript

## The Stack

**Hugo**

[github](https://github.com/gohugoio/hugo)

Static site generation. Blog posts with Markdown & Front Matter. The content is
pretty nice to manage and consists of some files in a directory:
[posts](https://github.com/jmoyers/jmoyers.org/tree/master/content/posts)

**nginx**

[Dockerfile](https://github.com/jmoyers/jmoyers.org/blob/master/Dockerfile)

Dead simple tls termination, static web server. Shortly I'll be turning on gzip
compression and tuning the ssl parameters. Hugo can serve html, but its really
more of a development tool per the current project maintainer.

I chose alpine linux for the container base because its got a small attack
surface and I don't need fancy tools in the container context.

**Terraform**

Infrastructure as code. The deployment on digital ocean consists of a firewall,
some dns records, a single droplet of the smallest size, all provisioned with
terraform here:
[infrastructure/](https://github.com/jmoyers/jmoyers.org/tree/master/infrastructure)

We make minimal use of the provisioning tools inside terraform, opting to manage
that with Ansible due to its slightly better model for managing state in remote
software.

This is evidenced by how silly it is to set up a docker swarm on multiple nodes
with terraform alone -- you have to set up an external data source, parse input
and output json and so on, when in reality you just want to run a command on a
machine and get the result back (in this case `docker swarm init`). Ansible does
this super well!

**Ansible**

Install some packages, set up systemd, install docker, start the swarm and
deploy the stack. It does these things really well with nothing more than its
`shell` module.

However, I'm going to be improving this by using its built-in python modules as
they do a better job of tracking idempotency on commands that you issue and not
doing unnecessary work. I'm also overusing local plays for convenience, right
now everything assumes and linux environment anyhow.

**Docker & Swarm**

Right now we ensure the services are up of being in a single node docker
swarm. docker's default policy with swarm services is to restart on failure.
docker itself is managed with systemd, and there is no special configuration
required there. the docker daemon isn't listening on any ports.

all docker remote management is done through ssh directly connecting to the
docker daemon with private keys. its actually so nice using docker's built in
support for ssh via `docker -H ssh://host.` this allows for more advanced setups
with bastion hosts, transparently, through `~/.ssh/config` files, without having
to worry about setting up docker daemon to listen on a port and screw around
with tls certs.

For this small deployment, we can manage docker services logs with the `docker service logs` command, which just takes nginx stdout and stderr and routes it to
the docker daemon logs via journald. This is easy out of the box!

All in all, I can write a post, run ansible play and not worry about it. Happy
with the project, and to finish it off I'll turn on gzip compression and tune
the ssl params on nginx to get an A+ rating.
