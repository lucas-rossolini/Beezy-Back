const hivesRouter = require('express').Router();
const Hives = require('../models/hives');

hivesRouter.get('/', (req, res) => {
  Hives.findMany(req.query)
    .then((hive) => {
      if (hive) {
        res.status(200).json(hive);
      } else {
        res.status(404).send('Aucune ruche trouvée');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les ruches depuis le serveur'
        );
    });
});

hivesRouter.get('/:id', (req, res) => {
  Hives.findOne(req.params.id)
    .then((hive) => {
      if (hive) {
        res.status(200).json(hive);
      } else {
        res.status(404).send('Aucune ruche trouvée');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les ruches depuis le serveur'
        );
    });
});

hivesRouter.post('/', (req, res) => {
  const error = Hives.checkMoviesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Hives.createOne(req.body)
      .then((result) => {
        res.send({ succes: 'Ruche enregistrée avec succès !', data: result });
      })
      .catch((err) => {
        console.error(err);
        res.send(
          'Une erreur est survenue lors de l`&apos`enregistrement de la ruche'
        );
      });
  }
});

hivesRouter.put('/:id', (req, res) => {
  const error = Hives.checkMoviesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Hives.updateOne(req.params.id, req.body)
      .then((result) => {
        res.send({ success: 'Ruche mise à jour avec succès !', data: result });
      })
      .catch((err) => {
        console.error(err);
        res.send('Une erreur est survenue lors de la mise à jour de la ruche');
      });
  }
});

hivesRouter.delete('/:id', (req, res) => {
  Hives.deleteOne(req.params.id)
    .then((result) => {
      res.send({ success: 'Ruche supprimée avec succès !', data: result });
    })
    .catch((err) => {
      console.error(err);
      res.send('Une erreur est survenue lors de la suppression de la ruche');
    });
});

module.exports = hivesRouter;
