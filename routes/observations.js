const observationsRouter = require('express').Router();
const Observations = require('../models/old_observations');

observationsRouter.get('/:rucheId', (req, res) => {
  Observations.findMany(req.params.rucheId)
    .then((observation) => {
      if (observation) {
        res.status(200).json(observation);
      } else {
        res.status(404).send('Aucune observation trouvée');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les observations depuis le serveur'
        );
    });
});

observationsRouter.get('/one/:id', (req, res) => {
  Observations.findOne(req.params.id)
    .then((observation) => {
      if (observation) {
        res.status(200).json(observation);
      } else {
        res.status(404).send('Aucune observation trouvée');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les observations depuis le serveur'
        );
    });
});

observationsRouter.post(
  '/',
  (req, res) => {
    // const error = Observations.checkObservationFields(req.body, true);
    // if (error) {
    //   console.log(error);
    //   res.status(401).send({ msg: 'Champs incorrects', error });
    // } else {
    Observations.createOne(req.body)
      .then((result) => {
        res.send({ succes: 'Ruche enregistrée avec succès !', data: result });
      })
      .catch((err) => {
        console.error(err);
        res.send(
          'Une erreur est survenue lors de l`&apos`enregistrement de l`&apos`observation'
        );
      });
  }
  // }
);

observationsRouter.put('/:id', (req, res) => {
  const error = Observations.checkObservationFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Observations.updateOne(req.params.id, req.body)
      .then((result) => {
        res.send({ success: 'Ruche mise à jour avec succès !', data: result });
      })
      .catch((err) => {
        console.error(err);
        res.send(
          'Une erreur est survenue lors de la mise à jour de l`&apos`observation'
        );
      });
  }
});

observationsRouter.delete('/:id', (req, res) => {
  Observations.deleteOne(req.params.id)
    .then((result) => {
      res.send({ success: 'Ruche supprimée avec succès !', data: result });
    })
    .catch((err) => {
      console.error(err);
      res.send(
        'Une erreur est survenue lors de la suppression de l`&apos`observation'
      );
    });
});

observationsRouter.delete('/:rucheId', (req, res) => {
  Observations.deleteOne(req.params.id)
    .then((result) => {
      res.send({ success: 'Ruche supprimée avec succès !', data: result });
    })
    .catch((err) => {
      console.error(err);
      res.send(
        'Une erreur est survenue lors de la suppression de l`&apos`observation'
      );
    });
});

module.exports = observationsRouter;
