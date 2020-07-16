# HTTP2 Server

_A simple, zero dependency, Node.js HTTP2 server for development projects._

HTTP2 Server uses Node's HTTP2 module to securely serve local files.  
Requests with no extension are optionally checked for with a `.html` extension.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Change Log](#change-log)
- [License](#license)
- [Attribution](#attribution)

## Prerequisites

The versions listed for these prerequisites are current at the time of writing.  
While more recent versions are likely to work, _your mileage may vary..._

- [Node v14.5 and NPM v6.14](https://nodejs.org/)

## Installation

1. Add HTTP2 Server as a developer dependency in your current web project:

    ```sh
    npm install tforster/http2-server --save-dev
    ```

2. Create a self-signed certificate in the project root:

    ```sh
    sh node_modules/http2-server/scripts/create-certs.sh
    ```

## Usage

1. Start the local development server:

    ```sh
    node node_modules/http2-server \
      --root $DIRECTORY_ROOT \
      --cert $DIRECTORY_CERT \
      --port $PORT \
      --extensions true # set to true to look for files with .html
    ```

## Contributing

To contribute to this project, please see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Change Log

All released versions are available as
[tags on this repository](https://github.com/webdivelement/projicon/tags).  
To view the release notes for all available versions, please see
[`CHANGELOG.md`](CHANGELOG.md).

## License

This project is licensed under the **MIT License**, please see
[`LICENSE.txt`](LICENSE.txt).

## Attribution

Created by [tforster](https://github.com/tforster).  
Based on code by [webdivelement](https://github.com/webdivelement).  
Maintained by [tforster](https://github.com/tforster) and
[webdivelement](https://github.com/webdivelement).

View the
[GitHub repository](https://github.com/tforster/http2-server)
or the
[list of contributors](https://github.com/tforster/http2-server/contributors)
for this project.
