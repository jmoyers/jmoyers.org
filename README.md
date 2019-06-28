https://jmoyers.org - personal website!

**Goals**

- Minimal administrative headache
- Write in a text editor on my local machine
- Programmatic backup and restore
- Ability to live edit css and any template
- Store some very basic meta data, like date, title, tags
- Some very basic date-based pagination
- Easy access to post processing tools for scss, minification etc
- Permalinks
- Containerized
- Process monitoring and logging through single node docker swarm
- One click deploy and service update

**Using**

- Docker for containerization
- nginx for tls termination, gzip compression
- Terraform for infrastructure deployment (Digital Ocean here)
- Ansible for provisioning - setting up docker swarm, minimal packages
- Hugo for static site generation
- vim, tmux, wsl for dev and writing environment
- Markdown with Front Matter for blog posts
- HTML/scss with BEM stylings, no external dependencies
