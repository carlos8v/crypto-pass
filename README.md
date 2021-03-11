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
The last script will initialize a `.env` file and build the `database.sqlite`.

⚠️ Important: all your data will be **lost** if you already have a `database.sqlite`.

After that you can simply run `npm run start` and visit the application ip on your browser.

If you want to modify your port on the `.env` file, remember to modify as well the `info.json` file on the *public/js* folder.

![Screenshots-home-v1.0](https://raw.githubusercontent.com/carlos8v/crypto-pass/main/screenshots/home-crypto-pass-1.0.png)

## Techs
 - Rest API;
 - JWT Authentication;
 - Hash cryptograph;

## To do list
- [ ] Sign up page;
- [ ] Create new password system on the front-end;
- [ ] Renovation of JWT token;
- [ ] Email a new user his password.

## Changelogs
- Redirection of non authenticated user on the front-end;
- Configuration script.
