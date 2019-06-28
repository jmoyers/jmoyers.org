http://jmoyers.org

Note that every single inotify based file watching utility seems broken on
WSL, so we're using entr -- compiled it statically. This means the package.json
scripts are not self contained.
