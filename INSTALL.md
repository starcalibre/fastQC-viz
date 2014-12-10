fastQC-viz install instructions
===============================

Instructions for contributors to get this up and running locally.

Firstly, you need node.js installed locally. From: [GitHub]. Installing it this way prevents any issues with permissions that can occur if you install node.js using ``sudo apt-get``.

```
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install # ok, fine, this step probably takes more than 30 seconds...
curl https://www.npmjs.org/install.sh | sh
```

Next you'll need [Bower], a great web package manager. This is installed via ```npm```, the node.js package manager that comes with node.

```npm install -g bower```

Clone the repo, and from the root directory install the dependencies for node.js. These dependencies are specified in ```package.json```.

```npm install```

Install the components with bower. Depenencies in Bower are specified in ```bower.json```.

```bower install```

Finally start the server.

```node server.js```

And now you should see the page on http://localhost:8080

[GitHub]:https://gist.github.com/isaacs/579814
[Bower]:http://bower.io/
