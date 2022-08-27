# Certificate

san11pk.org use [Let's Encrypt](https://letsencrypt.org/) to generate certificates.

[Detailed instruction](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal)

## Renew certificate

```
sudo certbot certonly --standalone

sudo cp -L /etc/letsencrypt/live/san11pk.org/fullchain.pem ~/credentials/san11pk.crt
sudo cp -L /etc/letsencrypt/live/san11pk.org/privkey.pem ~/~/credentials/san11pk-private-key.key
```
