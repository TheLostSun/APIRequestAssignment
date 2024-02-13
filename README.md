STEPS:-

1.Clone or download the repository.

2.Build the Docker image and start the container:

    In command prompt - docker-compose up

3. The web application will start running at [http://localhost:3000].

4. To test the APIs, we can use Postman Application if running on platform or direct url endpoint requests if running on Docker.(All responses will be visible on Postman itself) .

    ## For authorization :- specify the 'username' key as 'user' , 'password' key as 'pass' and 'token' key as 'dummy' in the Header section of the requests in Postman. Any different key-value pair will not work and error code will be recieved.

    a. To add record to the dataset:
        Specify the JSON object in the raw value section of the POST request.

        Then send the POST request to [http://localhost:3000/addRecord].

        If data is not already available then it will be added otherwise not.

    b. To delete record from the dataset:
        Send a DELETE request at [http://localhost:3000/deleteRecord/:name]. Replace name with the name of the user you want to delete the data of.

    c. Summary statistics for salary over the entire dataset:
        Send a GET request at [http://localhost:3000/summaryStatistics].

    d. Summary statistics for salary for records with "on_contract": "true":
        Send a GET request at [http://localhost:3000/summaryStatistics/onContract].

    e. Summary statistics for salary for each department:
        Send a GET request at [http://localhost:3000/summaryStatistics/byDepartment].

    f. Summary statistics for salary for each department and sub-department combination:
        Send a GET request at [http://localhost:3000/summaryStatistics/byDepartmentAndSubDepartment].

    EXTRAS for ease of access:
    
    g. To add all dummyData at once.
        Send a GET request at  [http://localhost:3000/fillData].
    
    h. To see the current state of the dataset.
        Send a GET request at [http://localhost:3000/dataset].

5. Stop and remove containers (when done):

    In command prompt - docker-compose down
    

        
        

