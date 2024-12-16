# Certificate
~~san11pk.org use [Let's Encrypt](https://letsencrypt.org/) to generate certificates.~~

san11pk.org use Caddy to manage https certificates.

[Detailed instruction](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal)

## Automation

Following cmd can renew certificate and setup renew job in the background.

```
sudo certbot certonly --standalone -d san11pk.org --agree-tos --non-interactive \
  --pre-hook "$HOME/san11-platform/scripts/cert-bot-pre-hook.sh" \
  --post-hook "$HOME/san11-platform/scripts/cert-bot-post-hook.sh"
```

## Renew certificate manually



```
sudo certbot certonly --standalone

sudo cp -L /etc/letsencrypt/live/san11pk.org/fullchain.pem ~/credentials/san11pk.crt
sudo cp -L /etc/letsencrypt/live/san11pk.org/privkey.pem ~/credentials/san11pk-private-key.key
```
