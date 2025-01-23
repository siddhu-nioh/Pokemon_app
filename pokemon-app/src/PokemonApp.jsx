import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardMedia, CardContent, Typography, TextField, Grid, Container } from "@mui/material";

const PokemonApp = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
        const results = response.data.results;

        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return {
              id: res.data.id,
              name: res.data.name,
              image: res.data.sprites.other["official-artwork"].front_default,
            };
          })
        );
        setPokemons(pokemonDetails);
      } catch (error) {
        console.error("Error fetching Pokémon data", error);
      }
    };
    fetchPokemons();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Pokémon Search
      </Typography>
      <TextField
        fullWidth
        label="Search Pokémon"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      <Grid container spacing={3}>
        {filteredPokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={3} key={pokemon.id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, textAlign: 'center', padding: 2 }}>
              <CardMedia component="img" height="200" image={pokemon.image} alt={pokemon.name} />
              <CardContent>
                <Typography variant="h5" component="div" sx={{ textTransform: 'capitalize' }}>
                  {pokemon.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PokemonApp;
