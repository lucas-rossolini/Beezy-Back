// response function that handle empty data or error on promise
const Response = (promise, res) => {
  promise()
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).send('Aucune donnée trouvée');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les données depuis le serveur'
        );
    });
};

module.exports = Response;
