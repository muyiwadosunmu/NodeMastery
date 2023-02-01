const fs = require('node:fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (id > tours.length || !tour)
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  return res.status(200).json({ status: 'Success', data: { tour } });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  return res.status(200).json({
    status: 'Success',
    data: {
      tour: `Updated tour.....`,
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  return res.status(204).json({
    status: 'Success',
    data: null,
  });
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };
