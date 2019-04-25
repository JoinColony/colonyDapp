# Generate a passphrase
openssl rand -base64 48 > passphrase.txt

# Generate a Private Key
openssl genrsa -aes128 -passout file:passphrase.txt -out server.key 2048

# Generate a CSR (Certificate Signing Request)
openssl req -new -passin file:passphrase.txt -key server.key -out server.csr \
    -subj "/C=FR/O=krkr/OU=Domain Control Validated/CN=*"

# Remove Passphrase from Key
cp server.key server.key.org
openssl rsa -in server.key.org -passin file:passphrase.txt -out server.key

# Generating a Self-Signed Certificate for 100 years
openssl x509 -req -days 36500 -in server.csr -signkey server.key -out server.crt

mv server.crt ssl.crt
mv server.key ssl.key
