exports.getOverview = (req, res) => {
  res.status(200).render('overview.pug', {
    tour: 'The forest hikers',
    user: 'Muyiwa',
  });
};

exports.getTour = (req, res) =>
  res.status(200).render('tour.pug', {
    title: 'The Forst Hiker',
  });
