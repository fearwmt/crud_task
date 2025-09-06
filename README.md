# Clone project
git clone https://github.com/fearwmt/crud_task.git
cd crud_task

# Backend setup
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev

# In a new terminal: Frontend setup
cd ../frontend
npm install
npm run dev
