import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { Model, DataTypes, Sequelize} from 'sequelize';

const app  = express();
const PORT = process.env.PORT || 3000;

const sequelize = new Sequelize(
    process.env.DB_NAME || 'dbname', 
    process.env.DB_USER || 'dbuser',      
    process.env.DB_PASS || 'dbpass',      
    {
      host: process.env.DB_HOST || 'dbhost', 
      dialect: 'mysql'
    }
  );
   console.log(process.env.DB_NAME)
   console.log(process.env.DB_USER)
   console.log(process.env.DB_PASS)
   console.log(process.env.DB_HOST)
// const sequelize = new Sequelize(
//     'ek_database',  // Database name
//     'root',         // Database user
//     's87ALbEs6f',   // Database password
//     {
//         host: '127.0.0.1', // Database host
//         dialect: 'mysql'
//     }
// );
  class Workers extends Model {}
  Workers.init({
      id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      text:{
          type:DataTypes.STRING,
          allowNull:false
      }
  },
  {
      sequelize,
      modelName: 'Workers',
      tableName: 'Workers',
      timestamps: false // use this to disable timestamps
  });
  
  
  
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  
  
  app.post('/worker', async (req, res) => {
      try {
          const { text } = req.body;
          if (!text) {
              return res.status(400).json({ error: 'Message text is required' });
          }
          const message = await Workers.create({ text });
          return res.status(201).json(message);
      } catch (error) {
          console.error('Error writing message:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  app.get('/workers', async (req, res) => {
      try {
          const messages = await Workers.findAll();
          return res.json(messages);
      } catch (error) {
          console.error('Error fetching messages:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  
  // app.get('/hello', (req: express.Request, res: express.Response) => {
  //     res.json({
  //         status: true,
  //         text  : 'hello world'
  //     })
  // })
  
  app.listen(PORT, async () => {
      try {
          await sequelize.authenticate();
          console.log('Connection has been established successfully.');
          // Sync models with the database
          await sequelize.sync();
          console.log('Models were synchronized successfully.');
      } catch (error) {
          console.error('Unable to connect to the database:', error);
      }
      console.log(`Server is running on port ${PORT}`);
  });

