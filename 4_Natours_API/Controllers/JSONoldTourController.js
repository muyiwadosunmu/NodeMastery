// const fs = require('node:fs');
// // const Tour = require('./../models/tourModels');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// const checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length)
//     return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//     return res
//       .status(400)
//       .json({ status: 'Fail', message: 'Missing Name or Price' });
//   next();
// };

// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   return res.status(200).json({
//     status: 'Success',
//     requestedAt: req.requestTime,
//     results: tours,
//     data: {
//       tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   // console.log(req.body);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'Success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour: 'Updated tour here',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       tour: 'Updated tour here',
//     },
//   });
// };

// module.exports = {
//   checkID,
//   checkBody,
//   getAllTours,
//   getTour,
//   createTour,
//   updateTour,
//   deleteTour,
// };
