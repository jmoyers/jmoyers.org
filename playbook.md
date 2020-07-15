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
