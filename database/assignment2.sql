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