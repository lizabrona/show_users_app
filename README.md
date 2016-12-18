# show_usrers_app
Test assignment for Devster Lab
Data is taken from ‘https://jsonplaceholder.typicode.com/users’
Search can be made using ‘name’, ‘username’, ‘email’ fields.
Sorting of records in alpabetical order or vise versa for ‘name’, ‘username’, ‘email’, ‘address.street’, ‘company.name’
The distance is calculated using current position if longitude and/or latitude are not available for current record, the distance will be set to 0.
The modal window is used for adding a new record, all fields are available for filling in except for ID.
The following form validation is used:
•         name – required;
•         username – required and unique;
•         email – required and unique;
•         phone – in ‘(ххх) ххх-хххх’ format;
•         website – in ‘<website_name>.<domain>’ format;
•         company.name – required and unique;
