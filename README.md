Untuk melakukan install
1. npm init untuk menginstall package json
2. npm install cors prisma
3. npm install dotenv
4. npm install --save-dev nodemon
5. npx prisma init --datasource-provider postgresql

Untuk melakukan run bisa dilakukan :
1. nodemon .
2. untuk cek data bisa ke http://localhost:2000/siswas
3. untuk melakukan pemasukan data maka lakukan perintah : 
  a. npx prisma studio
  b. lalu klick http://localhost:5555/

Untuk melakukan migrate dilakukan :
1. npx prisma generate
2. npx prisma db push
