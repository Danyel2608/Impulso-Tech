
# **IMPULSO TECH**

**BY DANIEL SALCEDO VIVANCOS**

---

## **Description**

Impulso Tech is an e-commerce project dedicated to urban fashion, where users can explore and purchase the latest trends in clothing, footwear, and accessories. The platform is designed to provide a unique shopping experience with simple and intuitive interfaces, making navigation easy and the purchasing process quick and secure. Additionally, Impulso Tech focuses on quality, style, and comfort, offering products that reflect the attitude and lifestyle of contemporary urban culture.

In this project, I used **React** for the frontend and **NodeJS** along with **MongoDB** for the backend.

### Why these technologies?

- **React**: Its ability to structure elements into components provides an organized and robust architecture.
- **NodeJS** and **MongoDB**: Although not as conventional as Symfony and MySQL, these technologies offer flexibility and simplicity, enhancing productivity and easing development.

---

## **Getting Started**

To run the project, you need to install **React** and **NodeJS**.  
Start the servers with the following commands:

- **Frontend**: `npm start` (in the React repository).
- **Backend**: `npm start` (in the NodeJS repository).

### **Necessary dependencies**:

**Frontend**:

```bash
npm install react react-dom react-router-dom react-scripts @testing-library/jest-dom @testing-library/react @testing-library/user-event web-vitals
```

**Backend**:

```bash
npm install bcrypt cors dotenv dotenv-extended express jsonwebtoken mongoose node-fetch nodemailer
npm install --save-dev nodemon
```

---

## **Project Installation**

1. **Clone the repository**:

```bash
git clone https://github.com/Danyel2608/Impulso-Tech.git
```

2. **Install dependencies**:
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     cd ..
     ```
   - **Backend**:
     ```bash
     cd backend
     npm install
     sudo systemctl start mongodb.service
     cd ..
     ```

---

## **Database**

Follow these steps to configure MongoDB:

1. Ensure MongoDB is running:
   ```bash
   sudo systemctl status mongod.service
   ```
2. Exit the service with `Ctrl + C`.
3. Go to the root directory of the project:
   ```bash
   cd ..
   ```
4. Extract the database file:
   ```bash
   unzip BBDD.zip
   ```
5. Import the collections from the mock database:
   ```bash
   mongoimport --uri="mongodb://localhost:27017/impulsotech" --collection=logins --file=BBDD/logins.metadata.json
   mongoimport --uri="mongodb://localhost:27017/impulsotech" --collection=newsletter --file=BBDD/newsletter.metadata.json
   mongoimport --uri="mongodb://localhost:27017/impulsotech" --collection=products --file=BBDD/products.metadata.json
   ```

---

## **.env Configuration**

1. Create a `.env` file in the **backend** folder.
2. Copy and paste the following content into the `.env` file:
   ```env
   PORT=8001
   MONGO_URI=mongodb://localhost:27017/impulsotech
   TOKEN_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   REFRESH_TOKEN_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EMAIL_USER=pruebasdani253@gmail.com
   EMAIL_PASS=hjeqkxltlwdyakwv
   ```

---

## **Run the Project**

1. **Backend**:  
   Start the backend server with:

   ```bash
   npm start
   ```

   Expected message:  
   `"Server running on port 8001. Successfully connected to the database!"`

2. **Frontend**:  
   Start the React server with:
   ```bash
   npm start
   ```

---

## **Basic Information on the Database**

The project includes a database to manage:

- Logins.
- Users subscribed to the newsletter.
- Available products.

**Example Login Document**:

```json
{
  "_id": {
    "$oid": "6763ee32c01ed82dcb298f60"
  },
  "email": "maria.lopez@example.com",
  "password": "$2b$10$exampleHashforMaria",
  "name": "Maria",
  "role": "admin",
  "lastName": "Lopez",
  "rememberMe": true,
  "security_question": "What is your favorite book?",
  "responsePrivate": "One Hundred Years of Solitude",
  "confirmEmail": true,
  "__v": 0
}
```

With the following endpoints:

| **URL**                               | **TYPE** | **DESCRIPTION**        | **ROLE**     |
|---------------------------------------|----------|------------------------|--------------|
| http://localhost:8001/auth/allLogins  | GET      | Get all logins          | admin        |
| http://localhost:8001/auth/loginId    | GET      | Get login by id         | admin        |
| http://localhost:8001/auth/user-data  | GET      | Get user's data         | admin        |
| http://localhost:8001/auth/refresh    | GET      | Refresh token           | admin        |
| http://localhost:8001/auth/login      | POST     | Post login              | user and admin |
| http://localhost:8001/auth/signup     | POST     | Sign up                 | user and admin |
| http://localhost:8001/auth/forget     | PUT      | Update forgotten password | user and admin |
| http://localhost:8001/auth/deleteUser | DELETE   | Delete user             | admin        |

**Example Newsletter Document**:

```json
{
  "_id": {
    "$oid": "6763ef47c01ed82dcb298f82"
  },
  "email": "maria.lopez@example.com",
  "createdAt": {
    "$date": "2024-12-19T10:10:12.542Z"
  },
  "updatedAt": {
    "$date": "2024-12-19T10:10:12.542Z"
  },
  "__v": 0
}
```

With the following endpoints:

| **URL**                                     | **TYPE** | **DESCRIPTION**                 | **ROLE**      |
|---------------------------------------------|----------|---------------------------------|---------------|
| http://localhost:8001/newsletter/subscribe  | POST     | Subscribe                        | admin and user |
| http://localhost:8001/newsletter/allNewsletterUsers | GET  | Get all newsletter subscribers   | admin        |
| http://localhost:8001/newsletter/deleteNewsletterUser | DELETE | Delete newsletter user      | admin        |

**Example Product Document**:

```json
{
  "_id": {
    "$oid": "6755c66d71d7e65011c12d71"
  },
  "nombre": {
    "es": "Nike camiseta niño",
    "en": "Nike t-shirt children"
  },
  "descripcion": {
    "es": "Este producto es una camiseta de la marca Nike, perfecto para niño. Está hecho de cuero y está disponible en color negro.",
    "en": "This product is a t-shirt from Nike, perfect for children. It's made of leather and comes in black."
  },
  "categoria": {
    "es": "niño",
    "en": "children"
  },
  "marca": "Nike",
  "tipo_prenda": {
    "es": "camiseta",
    "en": "t-shirt"
  },
  "precio": 12.1,
  "novedad": false,
  "rebaja": false,
  "descuento": 19,
  "talla": ["10"],
  "color": {
    "es": "negro",
    "en": "black"
  },
  "material": {
    "es": "cuero",
    "en": "leather"
  },
  "fecha_agregado": "2024-12-08",
  "stock": 51,
  "imagen_url": "/static/media/camiseta_nike.62620c533a822be7d1c4.jpg",
  "__v": 0
}
```

With the following endpoints:

| **URL**                                   | **TYPE** | **DESCRIPTION**                 | **ROLE**     |
|-------------------------------------------|----------|---------------------------------|--------------|
| http://localhost:8001/api/producto        | POST     | Create a product and save it to the DB | admin |
| http://localhost:8001/api/productos       | POST     | Create multiple products and save them to the DB | admin |
| http://localhost:8001/api/all-products    | GET      | Get all products                | admin        |
| http://localhost:8001/api/deleteId        | DELETE   | Delete a product                | admin        |
| http://localhost:8001/api/updateProduct   | PUT      | Update a product                | admin        |

**More Admin Endpoints**:
- http://localhost:8001/emails/confirmar/:email (To confirm email)
- http://localhost:8001/invoice/send-invoice (To send an invoice by email)

---

Thank you for your interest in this project! 🚀