# Clone project
git clone https://github.com/fearwmt/crud_task.git
cd crud_task

# Backend setup
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev

# In a new terminal: Frontend setup
cd frontend
npm install
npm run dev

<img width="713" height="907" alt="Screenshot 2568-09-06 at 10 59 26" src="https://github.com/user-attachments/assets/ae2c85dd-c816-4796-b546-06bca97cde1c" />
