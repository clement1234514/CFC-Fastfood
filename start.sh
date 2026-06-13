echo "=== CFC Fastfood - Starter ==="
echo ""
echo "1/3 - Database seed..."
cd database && npm install --silent && node seed.js && cd ..

echo ""
echo "2/3 - Backend starten (Port 5000)..."
cd backend && npm start &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "3/3 - Frontend starten (Port 3000)..."
cd frontend && npx next dev -p 3000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "=== CFC Fastfood läuft ==="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Test-Accounts:"
echo "  Admin:   677000000 / admin123"
echo "  Kunde:   699000000 / client123"
echo "  Lieferant: 655000000 / livreur123"
echo ""

wait
