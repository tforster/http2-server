#!/bins/sh

# Get the specified path or default to current execution path
path=${1:-.}

# Create the certificate and key file
openssl req \
  -x509 \
  -newkey rsa:2048 \
  -nodes \
  -sha256 \
  -subj '/CN=localhost' \
  -keyout $path/localhost-privkey.pem \
  -out $path/localhost-cert.pem
