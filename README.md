# HTTP2 Server

A simple, zero dependency, NodeJS HTTP2 server suitable for development projects.

HTTP2 Server uses Node's HTTP2 module to securely serve files from the local filesystem. Requests for files with no extension are first checked against the filesystem of the same name with a .html extension. In this way HTTP2 Server can support extensionless html files much the same way that AWS Amplify does. Making HTTP2 Server a great choice for developing for AWS Amplify.

## Installation

1. Add HTTP2 Server as a developer dependency in your current web project with `npm i @tforster/http2-server -D`.
2. Create a self-signed certificate alongside the index.js file. Navigate to subdirectory below node_modules containing the create-certs.sh file. In that directory run `sh create-certs.sh`. Note that the next version of HTTP2Server will support command line arguments to specify the location of the certificate files.
3. `npx http2-server`

## Built With

The following is a list of the technologies used to develop and manage this project.

| Tool                                                                                                              | Description                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Coffee](https://en.wikipedia.org/wiki/Coffee)                                                                    | A good source of [C8H10N4O2](https://pubchem.ncbi.nlm.nih.gov/compound/caffeine)                     |
| [Git 2.17.1](https://git-scm.com/)                                                                                | Source Code Management (SCM) client                                                                  |
| [NodeJS 13.1.0](https://nodejs.org/en/)                                                                           | Task running, automation and driving the API                                                         |
| [NPM 6.13.6](https://www.npmjs.com/package/npm)                                                                   | Node package management                                                                              |
| [Oh-My-Zsh](https://github.com/robbyrussell/oh-my-zsh)                                                            | ZSH shell enhancement                                                                                |
| [Ubuntu 18.04 for WSL2](https://www.microsoft.com/en-ca/p/ubuntu/9nblggh4msv6?activetab=pivot:overviewtab)        | Canonical supported Ubuntu for Windows Subsystem for Linux                                           |
| [Visual Studio Code 1.41.1](https://code.visualstudio.com/)                                                       | Powerful and cross-platform code editor                                                              |
| [Windows 10 Pro Insider Preview](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewadvanced) | The stable version of the Insiders build typically brings new tools of significant use to developers |
| [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)                                               | Windows Subsystem for Linux supports native Linux distributions                                      |
| [ZSH](https://www.zsh.org/)                                                                                       | A better shell than Bash                                                                             |

## Acknowledgements

Based on code originally developed by @webdivelement

## Change Log

v0.0.0 **Initial creation** (2020-01-28)
