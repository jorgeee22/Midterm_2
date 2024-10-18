const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const URL = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api';

// Ruta principal
app.get('/catalog', async (req, res) => {
    try {
        const response = await axios.get(`${URL}/all.json`);
        const superheroes = response.data;
        res.render('catalog', { superheroes, error: null });
    } catch (error) {
        res.send('Error al obtener los superhéroes');
    }
});

app.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const response = await axios.get(`${URL}/all.json`);
        const heroes = response.data.filter(hero => hero.name.toLowerCase().includes(name.toLowerCase()));
        
        if (heroes.length > 0) {
            res.render('index', { superheroes: heroes, error: null });
        } else {
            res.render('index', { superheroes: [], error: 'Superhéroe no encontrado' });
        }
    } catch (error) {
        res.send('Error al buscar el héroe');
    }
});

app.get('/', (req, res) => {
  res.render('home');  // Renderiza la vista index.ejs
});

  let currentIndex = 0;
app.get('/next', async (req, res) => {
  try {
    const response = await axios.get(`${URL}/all.json`);
    const heroes = response.data;
    currentIndex = (currentIndex + 1) % heroes.length;
    res.render('hero', { hero: heroes[currentIndex] });
  } catch (error) {
    res.send('Error al obtener los datos');
  }
});

app.get('/previous', async (req, res) => {
  try {
    const response = await axios.get(`${URL}/all.json`);
    const heroes = response.data;
    currentIndex = (currentIndex - 1 + heroes.length) % heroes.length;
    res.render('hero', { hero: heroes[currentIndex] });
  } catch (error) {
    res.send('Error al obtener los datos');
  }
});

// Ruta para ver los detalles de un solo superhéroe
app.get('/hero/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const response = await axios.get(`${URL}/all.json`);
        const heroes = response.data;

        // Encuentra el superhéroe correspondiente al ID
        const hero = heroes.find(h => h.id === id);
        
        // Encuentra el índice del superhéroe actual
        const currentIndex = heroes.findIndex(h => h.id === id);
        
        // Calcular el índice del siguiente y anterior héroe
        const nextIndex = (currentIndex + 1) % heroes.length; // Wrap around
        const prevIndex = (currentIndex - 1 + heroes.length) % heroes.length; // Wrap around

        res.render('hero', {
            hero,
            nextHeroId: heroes[nextIndex].id,
            prevHeroId: heroes[prevIndex].id
        });
    } catch (error) {
        res.send('Error al obtener los detalles del héroe');
    }
});
  
  
app.listen(3000, () => {
    console.log("Application listening port 3000");;
});
