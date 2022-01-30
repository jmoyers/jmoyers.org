Notes from 2022:

* Change content for posts and the main resume page in content/
* huge-prod command rebuilds static site
* ansible-playbook redeploy.yml rebuilds docker image and sends it to node01,
which is an ssh host set up
* Docker Desktop must be running

Notes from 7/15/2020

Try to spin up dev server. Following errors.

Building sites … ERROR 2020/07/15 11:30:06 render of "page" failed: "/home/jmoyers/dev/jmoyers.org/themes/jmoyers/layouts/\_default/baseof.html:7:35": execute of template failed: template: \_default/single.html:7:35: executing "\_default/single.html" at <resources.ToCSS>: error calling ToCSS: type <nil> not supported in Resource transformations
ERROR 2020/07/15 11:30:06 render of "page" failed: "/home/jmoyers/dev/jmoyers.org/themes/jmoyers/layouts/\_default/baseof.html:7:35": execute of template failed: template: \_default/single.html:7:35: executing "\_default/single.html" at <resources.ToCSS>: error calling ToCSS: type <nil> not supported in Resource transformations
ERROR 2020/07/15 11:30:06 render of "page" failed: "/home/jmoyers/dev/jmoyers.org/themes/jmoyers/layouts/\_default/baseof.html:7:35": execute of template failed: template: \_default/single.html:7:35: executing "\_default/single.html" at <resources.ToCSS>: error calling ToCSS: type <nil> not supported in Resource transformations
ERROR 2020/07/15 11:30:06 render of "page" failed: "/home/jmoyers/dev/jmoyers.org/themes/jmoyers/layouts/\_default/baseof.html:7:35": execute of template failed: template: \_default/single.html:7:35: executing "\_default/single.html" at <resources.ToCSS>: error calling ToCSS: type <nil> not supported in Resource transformations
Built in 23 ms
Error: Error building site: failed to render pages: render of "page" failed:
"/home/jmoyers/dev/jmoyers.org/themes/jmoyers/layouts/\_default/baseof.html:7:35":
execute of template failed: template: \_default/single.html:7:35: executing
"\_default/single.html" at <resources.ToCSS>: error calling ToCSS: type <nil> not
supported in Resource transformations

Looks like we didn't committ our scss file somehow?
Removed assets from gitignore. Actually annoyed.
Grabbed flat css file from the live site. Put it in assets/scss.

Re-ran dev server, but the specific ip address bind is not a thing. Removed all
that, connected directly to localhost (feature added to wsl).

Okay, now we need to handle the new SSL certification. Docker image shows its in
folder .ssl, lets build that up.

Need to create a csr request, standard openssl thing. Moved files to .ssl so
they aren't committed. Now we need to verify we own the domain. We can do that
with a dns record, so we may do that.

We created an admin@jmoyers.org email address instead, faster. Had confirmation
sent there.

Now we need to try to get docker compose to work locally.

For ssl, we need the following:

- dhparams.pem
- bundle.crt
- jmoyers.org-certchain.crt
- jmoyers.org.key

The key is from the csr, we have that.
dhparams.pem - Diffie-Hellman keys, because the default key size is 1024 bits in
openssl, we want to create dh params with a larger keysize.
https://scaron.info/blog/improve-your-nginx-ssl-configuration.html

Now we need to look at OCSP stapling, which we did before:
https://raymii.org/s/tutorials/OCSP_Stapling_on_nginx.html

Online Certificate Status Protocol -- verify the validity of the server
certificate ...

"In fact, the OCSP responders operated by CAs are often so unreliable that
browser will fail silently if no response is received in a timely manner. This
reduces security, by allowing an attacker to DoS an OCSP responder to disable
the validation."

This corresponds to the following ngnix settings we've enabled:
ssl_dhparam /run/secrets/dhparams.pem;
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /run/secrets/bundle.crt;

We need to check if our cert is already stapled, it should have a cert from
sectigo/comodo.

Point to a trusted certificate chain file. This must contain the intermediate &
root certificates in order

jmoyers_org.ca-bundle has two certs in it - we'll just try this

Lastly we need the "certchain" file that I think was just a concat of several.

We need root and intermediate certificate for comodo/sectigo, which they
apparently don't send. I found this link:

https://support.comodo.com/index.php?/comodo/Knowledgebase/Article/View/979/108/domain-validation-sha-2

I got both those files, catting the
comodo-rsa-domain-validation-sha-2-intermediates2.ca-bundle and
addtrustexternalcaroot.crt together into jmoyers.org-certchain.crt

I think maybe since we already have the trust chain in the bundle, we don't need
to do any of this, we'll try with the cert bare.

Now we need to test nginx. Don't think we have a way to do that right now
cause these ssl certs are for production domain.

So we need to make sure we have hugo built for production. There might be an
ansible command for this? Looks like redeploy rebuilds the docker image and
pushes to node01, so we're using an ssh config. Gotta set that up on this
machine. It does not do hugo static site gen.

So, do hugo static site gen... created a command hugo_prod

Now we also need terraform. They don't have in apt, so we need to grab binaries.
Was painless, grabbed and stuck in ~/bin

Okay, we don't have this rsa key anymore, gonna check digital ocean panel. Okay,
we generated a new key with ssh-keygen and updated the key in digitalocean
panel.

I went and got the digital ocean cli tool doctl, downloaded binary, moved it to
~/bin.

We need a digital ocean personal token, checking panel. Regenerated, set to
env variable DO_TOKEN.

doctl compute droplet list
doctl compute firewall list
doctl compute domain records list jmoyers.org

Now we need to import terraform state from digital ocean. We run...
terraform init

terraform import digitalocean\_{firewall|droplet|} {id}
we run these one at a time, including dns entries

We were missing DO_TOKEN and LOCAL_PUBLIC_IP variables from terraform. Needed a
terraform.tfvars file, which we created. This is excluded for git for obvious reasons.

This whole process with terraform without a state file due to a hard drive death
is literally the worst thing ever. Might as well commit the fkin' state to a
private repository or something.

Okay, we fixed terraform state. Manually imported every record, real dumb.

Now we need to get the node01 alias working via .ssh/config, this is not
automatically spit out by terraform post commit hook.

We need to use ssh keys to login. Lets get that working first.
We had to edit the .ssh/ config files on the machine to allow thr ight public
key. Apparently terraform doesn't md5 the file or anything, it just assumes
its the same and doesn't update it. Really useful!

I manually ran the docker commands. I think it swalled the fact that there was
no dhparams.pem file (i had a typo there). I ran each command and redeployed.
All fixed.

Running qualsys...

Looks like I fucked up the cert chain. Have a B. I'm fine with it.
