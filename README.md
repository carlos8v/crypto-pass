# The Project

A simple self-hosted password manager.

![Screenshots-login-v1.0](https://raw.githubusercontent.com/carlos8v/crypto-pass/main/screenshots/login-crypto-pass-1.0.png)

---

## How do I test?

After cloning / downloading the project run:
```bash
$ npm install
$ npm run config
```
It is important to know that **crypto-pass** uses [*nodemailer*](https://github.com/nodemailer/nodemailer) dependency to send a new user his password, and for that to work you will have to provide some SMTP info during the configuration script. It doesn't really matter what account you provide, it's just a way to send the new user info to the correct user.

Just for you to know, you will have to provide:
- SMTP Host;
- SMTP Port;
- SMTP Secure;
- SMTP User;
- SMTP Password.

This information is private and we don't have any ways of stealing that from you.

You can search for the necessary information from your email provider, it won't be difficult to find out. If you use *gmail* then you will also have to enable *less secure apps* config in this [link](https://www.google.com/settings/security/lesssecureapps).

After that the script will initialize a `.env` file and build the `database.sqlite`. 

> ⚠️ All your data will be **lost** if you already have a `database.sqlite` file saved.

Then you can simply run `npm run start` and visit the application ip on your browser.

If you want to modify your port on the `.env` file, remember to modify as well the `info.json` file on the *public/js* folder with your ip and port.

![Screenshots-home-v1.0](https://raw.githubusercontent.com/carlos8v/crypto-pass/main/screenshots/home-crypto-pass-1.0.png)

## Techs
- Rest API;
- JWT Authentication;
- Hash cryptograph;

## To do list
- [ ] Delete user in the front-end;

## One Step Further

If you want to host this application in a local server, you can modify the DNS hosts config in your router to map the ip of the application server on a custom hostname like **crypto-pass.local**, then you can go to *http://crypto-pass.local:3000* and the application will run as usual.

> ⚠️ You can change the apllication port to *80*, but this is **not recomended**. The *right* way to do it would be to install [*nginx*](https://www.nginx.com/) on the device that the application will be hosted and use it to redirect to the correct port.

## Changelogs
- Sign up page;
- Configuration script;
- Email a new user his password.
