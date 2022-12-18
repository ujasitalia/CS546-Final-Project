const {ObjectId} = require('mongodb');
const Review = [{
    "_id": ObjectId("639ebbd15a0afa65d7787e24"),
    "doctorId": "639ea11829a0a99a2e5bface",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4,
    "reviewText": "Good"
  },{
    "_id": ObjectId("639ebc082d2742c35a6232d5"),
    "doctorId": "639ea11829a0a99a2e5bface",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4.7,
    "reviewText": "Best"
  },{
    "_id": ObjectId("639ebc402d2742c35a6232d6"),
    "doctorId": "639ea11829a0a99a2e5bface",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4.9,
    "reviewText": "Great nature"
  },{
    "_id": ObjectId("639ebc692d2742c35a6232d7"),
    "doctorId": "639ea3bc29a0a99a2e5bfacf",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 2.2,
    "reviewText": "Scammer"
  },{
    "_id": ObjectId("639ebc9b2d2742c35a6232d8"),
    "doctorId": "639ea3bc29a0a99a2e5bfacf",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 1.5,
    "reviewText": "I don't know how he got his doctor degree"
  },{
    "_id": ObjectId("639ebcce2d2742c35a6232d9"),
    "doctorId": "639ea50d29a0a99a2e5bfad0",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4.3,
    "reviewText": "Short temper but great skills"
  },{
    "_id": ObjectId("639ebd172d2742c35a6232da"),
    "doctorId": "639ea50d29a0a99a2e5bfad0",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4.7,
    "reviewText": "Best interaction"
  },{
    "_id": ObjectId("639ebd322d2742c35a6232db"),
    "doctorId": "639ea5c429a0a99a2e5bfad1",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 4.4,
    "reviewText": "Sweat"
  },{
    "_id": ObjectId("639ebd6c2d2742c35a6232dc"),
    "doctorId": "639ea68c29a0a99a2e5bfad2",
    "patientId": "639eb4bc29a0a99a2e5bfae0",
    "rating": 2.7,
    "reviewText": "okay okay not that good"
  },{
    "_id": ObjectId("639ec046f6fb9a41f61500d8"),
    "doctorId": "639ea76929a0a99a2e5bfad3",
    "patientId": "639ebeb7f6fb9a41f61500d2",
    "rating": 4.1,
    "reviewText": "nice"
  },{
    "_id": ObjectId("639ec075f6fb9a41f61500d9"),
    "doctorId": "639ea8ad29a0a99a2e5bfad4",
    "patientId": "639ebeb7f6fb9a41f61500d2",
    "rating": 3,
    "reviewText": "not good"
  },{
    "_id": ObjectId("639ec091f6fb9a41f61500da"),
    "doctorId": "639eaad829a0a99a2e5bfad5",
    "patientId": "639ebeb7f6fb9a41f61500d2",
    "rating": 5,
    "reviewText": "Very good prof."
  },{
    "_id": ObjectId("639ec117f6fb9a41f61500db"),
    "doctorId": "639eabee29a0a99a2e5bfad6",
    "patientId": "639ebeb7f6fb9a41f61500d2",
    "rating": 3.9,
    "reviewText": "funny"
  },{
    "_id": ObjectId("639ec136f6fb9a41f61500dc"),
    "doctorId": "639eacb129a0a99a2e5bfad7",
    "patientId": "639ebeb7f6fb9a41f61500d2",
    "rating": 1.2,
    "reviewText": "Abusive"
  },{
    "_id": ObjectId("639ec334f6fb9a41f61500e8"),
    "doctorId": "639eb43729a0a99a2e5bfadf",
    "patientId": "639ec1f7f6fb9a41f61500e1",
    "rating": 5,
    "reviewText": "Really good and friendly"
  },{
    "_id": ObjectId("639ec3b2f6fb9a41f61500e9"),
    "doctorId": "639ead8329a0a99a2e5bfad8",
    "patientId": "639ec1f7f6fb9a41f61500e1",
    "rating": 1,
    "reviewText": "Egoistic and big talker"
  },{
    "_id": ObjectId("639ec3dbf6fb9a41f61500ea"),
    "doctorId": "639eae2429a0a99a2e5bfad9",
    "patientId": "639ec1f7f6fb9a41f61500e1",
    "rating": 2.2,
    "reviewText": "Kept chatting all time I don't know when to shut up"
  },{
    "_id": ObjectId("639ec405f6fb9a41f61500eb"),
    "doctorId": "639eaf2f29a0a99a2e5bfada",
    "patientId": "639ec1f7f6fb9a41f61500e1",
    "rating": 1.5,
    "reviewText": "Irresponsible doctor"
  },{
    "_id": ObjectId("639ec41cf6fb9a41f61500ec"),
    "doctorId": "639eb23e29a0a99a2e5bfadc",
    "patientId": "639ec1f7f6fb9a41f61500e1",
    "rating": 5,
    "reviewText": "Greatest Player of All Time"
  }]
module.exports = Review