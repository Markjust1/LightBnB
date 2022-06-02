INSERT INTO users (name, email, password)
  VALUES
  ('Michael Scott', 'scotttots@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
  ('Jim Halpert', 'bigtuna@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
  ('Oscar Martinez', 'omartinez@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' );


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES
  (1, 'City Lake Inn', 'description', 'picture', 'cover_picture', 120, 5, 2, 3, 'USA', 'Beach St', 'Wells', 'Maine', '09091', false),

  (2, 'Haunted House', 'description', 'picture', 'cover_picture', 200, 10, 5, 7, 'Canada', 'Dark Ave', 'Hope', 'BC', 'V1G6F7', false),

  (3, 'Castlemania', 'description', 'picture', 'cover_picture', 350, 30, 8, 9, 'Romania', 'Vampire Pl', 'Budapest', 'Transylvania', '24627', false);


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES
  ('2018-09-11', '2018-09-26', 1, 1),
  ('2019-01-04', '2019-02-01', 2, 2),
  ('2021-10-01', '2021-10-14', 3, 3);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES
  (1, 1, 1, 5, 'message'),
  (2, 2, 2, 7, 'message'),
  (3, 3, 3, 10, 'message');