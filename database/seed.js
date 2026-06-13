const db = require('./db');
const bcrypt = require('bcryptjs');

const hashPassword = (pw) => bcrypt.hashSync(pw, 10);//10 est le nombre de rounds de salage, plus c'est élevé plus c'est sécurisé mais plus c'est lent à générer et pw est le mot de passe en clair à hasher

db.exec('DELETE FROM order_items; DELETE FROM orders; DELETE FROM products; DELETE FROM categories; DELETE FROM users;');

const insertUser = db.prepare('INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)');
insertUser.run('admin-0000-0000-0000-000000000001', 'Admin CFC', '677000000', 'admin@cfc.cm', hashPassword('admin123'), 'admin');
insertUser.run('client-0000-0000-0000-000000000001', 'Jean Client', '699000000', 'jean@email.com', hashPassword('client123'), 'client');
insertUser.run('livreur-0000-0000-0000-000000000001', 'Paul Livreur', '655000000', 'paul@email.com', hashPassword('livreur123'), 'livreur');

const insertCategory = db.prepare('INSERT INTO categories (id, name, slug, image, sort_order) VALUES (?, ?, ?, ?, ?)');
insertCategory.run(1, 'Poulet Croustillant', 'poulet-croustillant', 'poulet.jpg', 1);
insertCategory.run(2, 'Burgers', 'burgers', 'burger.jpg', 2);
insertCategory.run(3, 'Menus Box', 'menus-box', 'box.jpg', 3);
insertCategory.run(4, 'Accompagnements', 'accompagnements', 'accompagnements.jpg', 4);
insertCategory.run(5, 'Boissons', 'boissons', 'boissons.jpg', 5);
insertCategory.run(6, 'Desserts', 'desserts', 'desserts.jpg', 6);

const insertProduct = db.prepare(`
  INSERT INTO products (id, category_id, name, description, price, image, spicy_level, available, customization_options)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let pid = 1;
const p = (cat, name, desc, price, img, spicy, avail, opts) => [`prod-${pid++}`, cat, name, desc, price, img, spicy, avail, opts];
const products = [
  p(1, 'Poulet Braisé (1/2)', 'Demi-poulet braisé aux épices camerounaises, servi avec sauce', 3500, 'poulet-braise.png', 'Pimenté', 1, JSON.stringify([{type:'sauce',options:['Mayonnaise','Ketchup','Sauce Pimentée','Sauce Ail']}])),
  p(1, 'Poulet Pané (4 pièces)', '4 morceaux de poulet pané croustillant, recette secrète CFC', 4000, 'poulet-pane-4.png', 'Moyen', 1, JSON.stringify([{type:'accompagnement',options:['Frites','Plantain','Miondo']},{type:'sauce',options:['Mayonnaise','Ketchup','Sauce Pimentée']}])),
  p(1, 'Poulet Pané (8 pièces)', '8 morceaux de poulet pané croustillant - idéal pour famille', 7000, 'poulet-pane-8.png', 'Moyen', 1, JSON.stringify([{type:'sauce',options:['Mayonnaise','Ketchup','Sauce Pimentée','Sauce Ail']}])),
  p(1, 'Ailes de Poulet (6)', '6 ailes de poulet marinées et frites', 3000, 'ailes-poulet.png', 'Pimenté', 1, JSON.stringify([{type:'sauce',options:['Mayonnaise','Ketchup','Sauce Pimentée']}])),
  p(2, 'CFC Royal Burger', 'Steak de poulet pané, salade, tomate, oignon, sauce spéciale CFC', 3500, 'royal-burger.png', 'Doux', 1, JSON.stringify([{type:'supplement',options:['Fromage +300','Bacon +500','Double Steak +1000']},{type:'sauce',options:['Mayonnaise','Ketchup','Barbecue','Pimentée']}])),
  p(2, 'CFC Spicy Burger', 'Steak de poulet épicé, jalapeños, cheddar, sauce piquante', 3800, 'spicy-burger.png', 'Pimenté', 1, JSON.stringify([{type:'supplement',options:['Fromage +300','Bacon +500','Double Steak +1000']}])),
  p(2, 'CFC Chicken Max', 'Double steak de poulet, salade, tomates confites, sauce césar', 4200, 'chicken-max.png', 'Doux', 1, JSON.stringify([{type:'supplement',options:['Fromage +300','Bacon +500']}])),
  p(3, 'Box Solo', '1 poulet frit + frites moyennes + 1 boisson 33cl', 4500, 'box-solo.png', 'Doux', 1, JSON.stringify([{type:'boisson',options:['Coca-Cola','Fanta','Sprite','Eau']},{type:'sauce',options:['Mayonnaise','Ketchup','Pimentée']}])),
  p(3, 'Box Duo', '1 poulet frit + grandes frites + 2 boissons 33cl', 5500, 'box-duo.png', 'Moyen', 1, JSON.stringify([{type:'boisson1',options:['Coca-Cola','Fanta','Sprite','Eau']},{type:'boisson2',options:['Coca-Cola','Fanta','Sprite','Eau']},{type:'sauce',options:['Mayonnaise','Ketchup','Pimentée']}])),
  p(3, 'Box Famille', '12 pièces de poulet pané + 2 grandes frites + 4 boissons 33cl', 12000, 'box-famille.png', 'Moyen', 1, JSON.stringify([{type:'boisson',options:['Coca-Cola','Fanta','Sprite','Eau']}])),
  p(3, 'Box Miondo', '1 poulet frit + miondo + sauce tomate/arachide', 3000, 'box-miondo.png', 'Doux', 1, null),
  p(4, 'Frites de Pommes (M)', 'Frites de pommes de terre fraîches, sel, épices CFC', 1500, 'frites-pomme.png', 'Doux', 1, null),
  p(4, 'Frites de Pommes (G)', 'Grandes frites de pommes de terre', 2000, 'frites-pomme-g.png', 'Doux', 1, null),
  p(4, 'Frites de Plantain', 'Plantain frit mûr ou vert, au choix', 2000, 'frites-plantain.png', 'Doux', 1, JSON.stringify([{type:'type',options:['Mûr','Vert']}])),
  p(4, 'Miondo (Bâton)', 'Miondo traditionnel camerounais, 2 bâtons', 1500, 'miondo.jpg', 'Doux', 1, null),
  p(4, 'Salade Coleslaw', 'Salade de chou frais, carotte, mayonnaise', 1000, 'coleslaw.png', 'Doux', 1, null),
  p(4, 'Frites de Patates douces', 'Patates douces frites', 2500, 'patates-frites.png', 'Doux', 1, JSON.stringify([{type:'sauce',options:['Arachide','Pimentée','Tomate']}])),
  p(5, 'Coca-Cola 33cl', '', 500, 'coca.jpg', 'Doux', 1, null),
  p(5, 'Fanta Orange 33cl', '', 500, 'fanta.jpg', 'Doux', 1, null),
  p(5, 'Sprite 33cl', '', 500, 'sprite.jpg', 'Doux', 1, null),
  p(5, 'Eau Minérale 50cl', '', 400, 'eau.jpg', 'Doux', 1, null),
  p(5, 'Jus de Bissap', 'Jus naturel d\'hibiscus, fait maison', 1000, 'bissap.jpg', 'Doux', 1, null),
  p(5, 'Jus de Gingembre', 'Jus de gingembre frais, fait maison', 1000, 'gingembre.jpg', 'Doux', 1, null),
  p(6, 'Tarte à l\'Ananas', 'Tarte à l\'ananas caramélisé, fait maison', 2000, 'tarte-ananas.jpg', 'Doux', 1, null),
  p(6, 'Beignets (6)', '6 beignets sucrés à la vanille', 1500, 'beignets.jpg', 'Doux', 1, null),
  p(6, 'Glace Vanille', 'Glace à la vanille, 2 boules', 1500, 'glace.jpg', 'Doux', 1, null),
];

for (const p of products) {
  insertProduct.run(...p);
}

console.log('=== Base de données initialisée ===');
console.log('Admin:  677000000 / admin123');
console.log('Client: 699000000 / client123');
console.log('Livreur: 655000000 / livreur123');
console.log(`Produits: ${products.length} dans ${6} catégories`);
