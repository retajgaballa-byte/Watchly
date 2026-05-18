/*
  Watchy Streaming Platform - GitHub Pages Version
  Frontend: HTML/CSS/JavaScript
  Backend logic: service functions in this file
  Database integration: localStorage browser database
*/

const DB = {
  USERS: 'watchy_simple_users',
  MOVIES: 'watchy_simple_movies',
  SESSION: 'watchy_simple_session',
  VAULT: 'watchy_simple_vault',
  RATINGS: 'watchy_simple_ratings'
};

const seedMovies = [
  { id: 1, title: 'Neon Reckoning', genre: 'Sci-Fi', type: 'Movie', year: 2024, duration: '2h 14m', rating: 4.8, status: 'Published', studio: 'Onyx Labs', director: 'Elena Vance', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=900&auto=format&fit=crop', description: 'In the rain-slicked labyrinths of Neo Aethelgard, a detective uncovers a digital conspiracy that threatens the city.' },
  { id: 2, title: 'The Gilded Age', genre: 'Drama', type: 'Series', year: 2023, duration: 'Season 2', rating: 4.6, status: 'Scheduled', studio: 'Heritage Pictures', director: 'Mira Stone', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop', description: 'A luxury historical drama about power, ambition, and family secrets.' },
  { id: 3, title: 'Silent Corridor', genre: 'Thriller', type: 'Movie', year: 2024, duration: '1h 58m', rating: 4.3, status: 'Draft', studio: 'Noir Collective', director: 'Julian Moore', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop', description: 'A psychological thriller inside an abandoned theater.' },
  { id: 4, title: 'Frozen Echoes', genre: 'Nature', type: 'Original', year: 2025, duration: 'IMAX', rating: 4.7, status: 'Published', studio: 'Prism Indies', director: 'Sara Lane', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=900&auto=format&fit=crop', description: 'A cinematic documentary exploring ice, survival, and wilderness.' },
  { id: 5, title: 'Midnight Drive', genre: 'Thriller', type: 'Movie', year: 2024, duration: '98m', rating: 4.5, status: 'Published', studio: 'Metro Arts', director: 'Adam Grey', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop', description: 'A night ride becomes a dangerous mission through a neon city.' },
  { id: 6, title: 'Red Horizon', genre: 'Action', type: 'Movie', year: 2025, duration: '2h 3m', rating: 4.4, status: 'Published', studio: 'Empire Pictures', director: 'Noah Reed', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop', description: 'A mission across the desert horizon reveals a hidden war.' }
];

const seedUsers = [
  { id: 1, name: 'Theater Manager', email: 'admin@watchy.com', password: 'admin123', role: 'admin', status: 'Active' },
  { id: 2, name: 'Elena Vancamp', email: 'user@watchy.com', password: 'user123', role: 'user', status: 'Active' },
  { id: 3, name: 'Julian Sterling', email: 'julian@watchy.com', password: '123456', role: 'user', status: 'Suspended' }
];

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function initDB() {
  if (!localStorage.getItem(DB.USERS)) write(DB.USERS, seedUsers);
  if (!localStorage.getItem(DB.MOVIES)) write(DB.MOVIES, seedMovies);
  if (!localStorage.getItem(DB.VAULT)) write(DB.VAULT, []);
  if (!localStorage.getItem(DB.RATINGS)) write(DB.RATINGS, []);
}

const UserService = {
  all: () => read(DB.USERS, []),
  register(name, email, password) {
    const users = this.all();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already exists');
    const user = { id: Date.now(), name, email, password, role: 'user', status: 'Active' };
    users.push(user); write(DB.USERS, users); write(DB.SESSION, user); return user;
  },
  login(email, password) {
    const user = this.all().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    if (user.status === 'Suspended') throw new Error('This account is suspended');
    write(DB.SESSION, user); return user;
  },
  logout() { localStorage.removeItem(DB.SESSION); },
  session: () => read(DB.SESSION, null),
  toggleStatus(id) {
    const users = this.all().map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u);
    write(DB.USERS, users);
  }
};

const MovieService = {
  all: () => read(DB.MOVIES, []),
  add(movie) {
    const movies = this.all();
    movies.push({ ...movie, id: Date.now(), rating: 4.5, status: 'Draft', image: movie.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop' });
    write(DB.MOVIES, movies);
  },
  remove(id) { write(DB.MOVIES, this.all().filter(m => m.id !== id)); },
  find(id) { return this.all().find(m => m.id === Number(id)); }
};

const VaultService = {
  all: () => read(DB.VAULT, []),
  add(userId, movieId) {
    const vault = this.all();
    const item = `${userId}-${movieId}`;
    if (!vault.includes(item)) vault.push(item);
    write(DB.VAULT, vault);
  },
  remove(userId, movieId) { write(DB.VAULT, this.all().filter(v => v !== `${userId}-${movieId}`)); },
  has(userId, movieId) { return this.all().includes(`${userId}-${movieId}`); },
  movies(userId) { return MovieService.all().filter(m => this.has(userId, m.id)); }
};

const RatingService = {
  rate(userId, movieId, value) {
    const ratings = read(DB.RATINGS, []);
    const old = ratings.find(r => r.userId === userId && r.movieId === movieId);
    if (old) old.value = value; else ratings.push({ userId, movieId, value });
    write(DB.RATINGS, ratings);
    alert('Rating saved successfully');
  }
};

const state = { page: 'home', query: '', selectedMovieId: null };
const app = document.getElementById('app');

function navTo(page, movieId = null) {
  state.page = page;
  state.selectedMovieId = movieId;
  render();
  window.scrollTo(0,0);
}

function render() {
  const user = UserService.session();
  if (!user && !['signin','signup'].includes(state.page)) state.page = 'signin';
  if (state.page === 'signin') return renderSignIn();
  if (state.page === 'signup') return renderSignUp();
  if (state.page === 'admin') return renderAdmin('dashboard');
  if (state.page === 'content') return renderAdmin('content');
  if (state.page === 'users') return renderAdmin('users');
  if (state.page === 'analytics') return renderAdmin('analytics');
  if (state.page === 'details') return renderUserLayout(renderDetails());
  if (state.page === 'vault') return renderUserLayout(renderVault());
  if (state.page === 'premiere') return renderUserLayout(renderPremiere());
  return renderUserLayout(renderHome());
}

function renderSignIn(error = '') {
  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-wrap">
        <h1 class="brand">Watchy</h1>
        <p class="subtitle">THE PREMIERE EXPERIENCE</p>
        <div class="auth-card">
          <div class="tabs"><button class="active">SIGN IN</button><button onclick="navTo('signup')">SIGN UP</button></div>
          ${error ? `<div class="error">${error}</div>` : ''}
          <label>EMAIL ADDRESS</label>
          <input id="email" value="admin@watchy.com" />
          <label>PASSWORD</label>
          <input id="password" type="password" value="admin123" />
          <button class="gold-btn full" onclick="handleLogin()">SIGN IN</button>
          <p class="hint">Admin: admin@watchy.com / admin123<br>User: user@watchy.com / user123</p>
        </div>
      </div>
    </section>`;
}

function renderSignUp(error = '') {
  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-wrap">
        <h1 class="brand">Watchy</h1>
        <p class="subtitle">JOIN THE PREMIERE</p>
        <div class="auth-card">
          <div class="tabs"><button onclick="navTo('signin')">SIGN IN</button><button class="active">SIGN UP</button></div>
          ${error ? `<div class="error">${error}</div>` : ''}
          <label>FULL NAME</label><input id="name" value="New User" />
          <label>EMAIL ADDRESS</label><input id="email" value="newuser@watchy.com" />
          <label>PASSWORD</label><input id="password" type="password" value="123456" />
          <button class="gold-btn full" onclick="handleRegister()">CREATE ACCOUNT</button>
          <p class="hint">Already a member? <button class="link" onclick="navTo('signin')">Sign In</button></p>
        </div>
      </div>
    </section>`;
}

function renderUserLayout(content) {
  const user = UserService.session();
  app.innerHTML = `
    <header class="nav">
      <button class="logo" onclick="navTo('home')">Watchy</button>
      <button onclick="navTo('premiere')">Premiere</button>
      <button onclick="navTo('home')">Movies</button>
      <button onclick="navTo('vault')">My Vault</button>
      ${user.role === 'admin' ? `<button onclick="navTo('admin')">Admin</button>` : ''}
      <div class="search"><span>🔍</span><input placeholder="Search films..." value="${state.query}" oninput="state.query=this.value; render()" /></div>
      <button class="logout" onclick="handleLogout()">Logout</button>
    </header>
    ${content}
    <footer><h3 class="brand">Watchy Cinema</h3><p><a>Privacy Policy</a><a>Terms of Service</a><a>Help Center</a></p><p>© 2026 Watchy Streaming Platform</p></footer>`;
}

function filteredMovies() {
  const q = state.query.toLowerCase();
  return MovieService.all().filter(m => `${m.title} ${m.genre} ${m.type}`.toLowerCase().includes(q));
}

function renderHome() {
  return `
    <section class="hero">
      <div class="hero-content">
        <span class="badge">THE PREMIERE EXPERIENCE</span>
        <h1>Unlimited Movies,<br><em>TV Shows</em>, and More.</h1>
        <p>Watchy is a streaming platform for browsing movies, searching content, saving to a watchlist, rating content, and managing content through an admin dashboard.</p>
        <div class="actions"><button class="gold-btn" onclick="document.getElementById('movies').scrollIntoView()">GET STARTED</button><button class="outline" onclick="navTo('premiere')">VIEW PREMIERE</button></div>
      </div>
    </section>
    <section class="section" id="movies"><p class="section-label">CURATED SELECTION</p><h2>Trending Now</h2>${movieGrid(filteredMovies())}</section>
    <section class="section feature-row"><div class="video-box">▶</div><div><p class="section-label">EXCLUSIVE TECHNOLOGY</p><h2>Crystal Clear, Purely Immersive.</h2><div class="feature"><b>Ultra HD Streaming</b><p>High-quality viewing simulation.</p></div><div class="feature"><b>Watchlist</b><p>Save movies into My Vault using localStorage.</p></div><div class="feature"><b>Admin Control</b><p>Admin can add and delete content.</p></div></div></section>`;
}

function renderPremiere() {
  return `
    <section class="hero small">
      <div class="hero-content">
        <span class="badge">EXCLUSIVE PREMIERE</span>
        <h1>Neon Reckoning</h1>
        <p>Explore a dark cinematic experience with curated movies and personalized watchlist features.</p>
        <div class="actions"><button class="gold-btn" onclick="navTo('details',1)">WATCH NOW</button><button class="outline" onclick="addToVault(1)">+ ADD TO VAULT</button></div>
      </div>
    </section>
    <section class="section"><h2>Curated For You</h2>${movieGrid(filteredMovies())}</section>`;
}

function movieGrid(movies) {
  if (!movies.length) return `<div class="empty">No movies found.</div>`;
  return `<div class="grid">${movies.map(m => `
    <div class="card">
      <div class="poster" style="background-image:url('${m.image}')" onclick="navTo('details',${m.id})"></div>
      <div class="card-body">
        <h3 onclick="navTo('details',${m.id})">${m.title}</h3>
        <p>${m.genre} · ${m.year} · ${m.duration}</p>
        <p>⭐ ${m.rating} | ${m.status}</p>
        <div class="card-actions"><button class="small-btn small-gold" onclick="navTo('details',${m.id})">Details</button><button class="small-btn" onclick="addToVault(${m.id})">+ Vault</button></div>
      </div>
    </div>`).join('')}</div>`;
}

function renderDetails() {
  const m = MovieService.find(state.selectedMovieId) || MovieService.all()[0];
  return `
    <section class="details" style="background-image:linear-gradient(90deg,#050505 35%,rgba(0,0,0,.25)),url('${m.image}')">
      <div>
        <p class="section-label">NOW PREMIERING</p>
        <h1>${m.title}</h1>
        <p>⭐ ${m.rating} · ${m.year} · ${m.duration} · ${m.genre}</p>
        <p>${m.description}</p>
        <div class="actions"><button class="gold-btn" onclick="alert('Streaming started simulation')">▶ Watch Now</button><button class="outline" onclick="addToVault(${m.id})">+ Add to Vault</button></div>
        <div class="actions"><button class="small-btn" onclick="rateMovie(${m.id},1)">1 ⭐</button><button class="small-btn" onclick="rateMovie(${m.id},3)">3 ⭐</button><button class="small-btn" onclick="rateMovie(${m.id},5)">5 ⭐</button></div>
      </div>
      <div class="info-box"><div class="trailer">▶ OFFICIAL TRAILER</div><p><b>Director:</b> ${m.director}</p><p><b>Studio:</b> ${m.studio}</p><p><b>Type:</b> ${m.type}</p><p><b>Status:</b> ${m.status}</p></div>
    </section>
    <section class="section"><h2>More Like This</h2>${movieGrid(MovieService.all().filter(x => x.id !== m.id).slice(0,4))}</section>`;
}

function renderVault() {
  const user = UserService.session();
  const movies = VaultService.movies(user.id);
  return `<section class="section" style="min-height:70vh"><h1>My Vault</h1><p>Your saved watchlist content.</p>${movies.length ? `<div class="grid">${movies.map(m => `<div class="card"><div class="poster" style="background-image:url('${m.image}')" onclick="navTo('details',${m.id})"></div><div class="card-body"><h3>${m.title}</h3><p>${m.genre} · ${m.year}</p><button class="danger" onclick="removeFromVault(${m.id})">Remove</button></div></div>`).join('')}</div>` : `<div class="empty">No saved movies yet.</div>`}</section>`;
}

function renderAdmin(section) {
  const user = UserService.session();
  if (!user || user.role !== 'admin') { state.page = 'home'; return render(); }
  const content = section === 'content' ? adminContent() : section === 'users' ? adminUsers() : section === 'analytics' ? adminAnalytics() : adminDashboard();
  app.innerHTML = `
    <div class="admin">
      <aside class="side"><h2 class="admin-title">Watchy Admin</h2><small>CONTROL PANEL</small><hr style="border-color:var(--border);margin:25px 0"><button onclick="navTo('admin')">▦ Dashboard</button><button onclick="navTo('content')">▣ Content Library</button><button onclick="navTo('users')">☻ User Management</button><button onclick="navTo('analytics')">▤ Analytics</button><div class="bottom"><button onclick="navTo('home')">View Website</button><button onclick="handleLogout()">Logout</button></div></aside>
      <main class="main">${content}</main>
    </div>`;
}

function adminDashboard() {
  const movies = MovieService.all(), users = UserService.all();
  return `<p class="section-label">THEATER PERFORMANCE</p><h1>Live Operations</h1><div class="stats"><div class="stat"><p>Total Content</p><h2>${movies.length}</h2></div><div class="stat"><p>Total Users</p><h2>${users.length}</h2></div><div class="stat"><p>Monthly Box Office</p><h2>$1.2M</h2></div><div class="stat"><p>Average Rating</p><h2>4.8/5</h2></div></div><div class="panel"><h2>Recent Exhibitions</h2>${movieTable(movies.slice(0,5), false)}</div>`;
}

function adminContent() {
  return `<h1>Content Library</h1><p>Manage movies and series content.</p><div class="form-row"><input id="movieTitle" placeholder="Movie title"><select id="movieGenre"><option>Sci-Fi</option><option>Drama</option><option>Thriller</option><option>Action</option></select><button class="gold-btn" onclick="addMovie()">+ Add Content</button></div><div class="panel">${movieTable(MovieService.all(), true)}</div>`;
}

function movieTable(movies, withActions) {
  return `<table><thead><tr><th>Title</th><th>Genre</th><th>Year</th><th>Status</th>${withActions ? '<th>Action</th>' : ''}</tr></thead><tbody>${movies.map(m => `<tr><td>${m.title}<br><small>${m.type} · ${m.duration}</small></td><td>${m.genre}</td><td>${m.year}</td><td><span class="pill">${m.status}</span></td>${withActions ? `<td><button class="danger" onclick="deleteMovie(${m.id})">Delete</button></td>` : ''}</tr>`).join('')}</tbody></table>`;
}

function adminUsers() {
  const users = UserService.all();
  return `<h1>User Registry</h1><p>Manage registered users.</p><div class="stats"><div class="stat"><p>Total Audience</p><h2>${users.length}</h2></div><div class="stat"><p>Active</p><h2>${users.filter(u=>u.status==='Active').length}</h2></div><div class="stat"><p>Admins</p><h2>${users.filter(u=>u.role==='admin').length}</h2></div><div class="stat"><p>New This Week</p><h2>14.2k</h2></div></div><div class="panel"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Activity</th><th>Action</th></tr></thead><tbody>${users.map(u=>`<tr><td>${u.name}<br><small>${u.email}</small></td><td>${u.role}</td><td><span class="pill">${u.status}</span></td><td>${u.role==='admin'?'Managing platform':'Watching content'}</td><td><button class="small-btn" onclick="toggleUser(${u.id})">Toggle Status</button></td></tr>`).join('')}</tbody></table></div>`;
}

function adminAnalytics() {
  return `<h1>Analytics</h1><p>Operational reports and platform statistics.</p><div class="stats"><div class="stat"><p>Revenue</p><h2>$1.24M</h2></div><div class="stat"><p>Admissions</p><h2>84.2k</h2></div><div class="stat"><p>Rating</p><h2>4.9/5</h2></div><div class="stat"><p>Storage</p><h2>74 TB</h2></div></div><div class="panel"><h2>Revenue Analysis</h2><div class="bar-chart"><div style="height:45%"></div><div style="height:65%"></div><div style="height:50%"></div><div style="height:75%"></div><div style="height:60%"></div><div style="height:90%"></div></div></div>`;
}

function handleLogin() {
  try {
    const user = UserService.login(document.getElementById('email').value.trim(), document.getElementById('password').value);
    navTo(user.role === 'admin' ? 'admin' : 'home');
  } catch(e) { renderSignIn(e.message); }
}
function handleRegister() {
  try {
    UserService.register(document.getElementById('name').value.trim(), document.getElementById('email').value.trim(), document.getElementById('password').value);
    navTo('home');
  } catch(e) { renderSignUp(e.message); }
}
function handleLogout() { UserService.logout(); navTo('signin'); }
function addToVault(movieId) { const user = UserService.session(); VaultService.add(user.id, movieId); alert('Added to My Vault'); render(); }
function removeFromVault(movieId) { const user = UserService.session(); VaultService.remove(user.id, movieId); render(); }
function rateMovie(movieId, value) { const user = UserService.session(); RatingService.rate(user.id, movieId, value); }
function addMovie() {
  const title = document.getElementById('movieTitle').value.trim();
  const genre = document.getElementById('movieGenre').value;
  if (!title) return alert('Enter movie title');
  MovieService.add({ title, genre, type: 'Movie', year: 2026, duration: '2h', studio: 'Watchy Studio', director: 'Admin', description: 'New content added by admin.' });
  renderAdmin('content');
}
function deleteMovie(id) { if(confirm('Delete this content?')) { MovieService.remove(id); renderAdmin('content'); } }
function toggleUser(id) { UserService.toggleStatus(id); renderAdmin('users'); }

initDB();
render();
