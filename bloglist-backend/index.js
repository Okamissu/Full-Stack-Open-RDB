require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {},
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  },
);

// Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll({});
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const deletedRows = await Blog.destroy({
      where: { id: req.params.id },
    });

    if (!deletedRows) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    await Blog.sync();
    console.log('Connected to the database');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

start();
