# File-processor

## Why?

I needed an example of how to use Typescript and NodeJS, and also needed to do some file processing. Thus, a wee template for streaming a set of files through a handler.

## What's it good for?

If you are batch processing files that change or land in a folder, and you'd like to just 'watch' a folder and execute the batch whenever there is a matching change... this template is for you. 

It also demonstrates file handling, injection, using Typescript with NodeJS (which is pretty common nowadays, but was rather novel back when this was first created).

There are also a bunch of stray utility classes that were pulled in from another project. These do need to be pruned, but some are useful for the brave explorer. Mostly they're just extraneous though - so just ignore the 'util' package unless you are inspecting along in the 'file-watcher' package and see something you want to understand better. 

## Getting Started

Assuming you're starting from zero, you'll need a few things. NodeJs, Yarn, a development environment. Links follow.


### Supporting Tools

* Git: https://git-scm.com/downloads (or perhaps https://desktop.github.com if you prefer)
* WebStorm: https://www.jetbrains.com/webstorm/download/
* nodeenv: https://github.com/nodenv/nodenv

Once you've installed all of the above, clone this project and get started:

```bash
mkdir -p ~/github/youAtGithub/
cd ~/github/youAtGithub/
git clone git@github.com:ggranum/nodejs-file-processor-template.git
cd nodejs-file-processor-template
npm install

```
