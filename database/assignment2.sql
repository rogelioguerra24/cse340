--QUERY 1--
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email, 
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

--QUERY 2--
UPDATE public.account 
    SET account_type = 'Admin' 
    WHERE account_firstname = 'Tony';

--QUERY 3--
DELETE FROM public.account 
    WHERE account_firstname = 'Tony';

--QUERY 4--
UPDATE public.inventory 
    SET inv_description = REPLACE(inv_description, 'a huge interior', 'small interiors')
    WHERE inv_model = 'Hummer'; 

--QUERY 5--
SELECT i.inv_make, i.inv_model, c.classification_name
    FROM public.inventory i
    INNER JOIN public.classification c
    ON i.classification_id = c.classification_id
    WHERE c.classification_id = 2;

--QUERY 6--
UPDATE public.inventory 
    SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
        inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


--QUERY 7 -- 
INSERT INTO public.review (review_description, review_date, 
account_id, inv_id) VALUES 
('This is an amazind AUDI Bro', '2025-08-11', 1, 12);

--QUERY 8 -- 
SELECT * 
FROM public.inventory i
inner join public.review p
ON i.inv_id = p.inv_id;

--QUERY 9 --
SELECT r.review_id, r.review_date, r.review_description, a.account_firstname  
FROM public.review r
inner join public.account a
ON r.account_id = a.account_id
WHERE r.inv_id = 12;

--QUERY 10 --
UPDATE public.review
    SET review_description = 'This is a beauty Camaron', review_date = '2025-09-11'
    WHERE review_id = 1;

--QUERY 11--
DELETE FROM public.review
    WHERE review_id = 4;