[
  {
    $match: {
      product: new ObjectId("63f38f9262c7c1e783938db4"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
