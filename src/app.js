const express = require('express');
const bodyParser = require('body-parser');
const moduleData=require('./fullData');
const app = express();
const port = 3000;


let dataset = [];
app.use(bodyParser.json());

const dummyUser = { username: 'user', password: 'pass' };
const authToken = 'dummy';

//Middleware for autorization. All things defined in header.
const authenticateAndAuthorize = (req, res, next) => {
    const { username, password, token } = req.headers;
    if (username !== dummyUser.username || password !== dummyUser.password) {
        return res.status(401).json({ error: 'Authentication failed. Wrong Credentials.' });
    }
    if (token !== authToken) {
        return res.status(403).json({ error: 'Authorization failed. Wrong Token' });
    }

    next();
};

//Helper function to calculate mean of the numbers
const calculateMean = (numbers) => {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

//Extra API to see the current database schema
app.get('/dataset',authenticateAndAuthorize, (req,res)=>{
    res.json(dataset);
})
//Extra API to add dummy data at once
app.get('/fillData',authenticateAndAuthorize, (req,res)=>{
    dataset=moduleData.fulldata;
    res.json({message:'All Dummy Data added.'});
})
//API to add a new record to the dataset
app.post('/addRecord', authenticateAndAuthorize, (req, res) => {
    const newRecord = req.body;
    const existingRecordIndex = dataset.findIndex(record => record.name === newRecord.name);
    if (existingRecordIndex !== -1) {
        return res.status(400).json({ error: 'Record with the same name already exists.' });
    }
    dataset.push(newRecord);
    res.json({ message: 'Record added successfully.' });
});

// API to delete a record from the dataset
app.delete('/deleteRecord/:name', authenticateAndAuthorize, (req, res) => {
    const nameToDelete = req.params.name;
    const indexToDelete = dataset.findIndex((record) => record.name === nameToDelete);

    if (indexToDelete !== -1) {
        dataset.splice(indexToDelete, 1);
        res.json({ message: 'Record deleted successfully.' });
    } else {
        res.status(404).json({ error: 'Record not found.' });
    }
});

// API to fetch summary statistics for salary over the entire dataset
app.get('/summaryStatistics', authenticateAndAuthorize, (req, res) => {
    const salaries = dataset.map(record => parseFloat(record.salary));
    const mean = calculateMean(salaries);
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    res.json({ mean, min, max });
});
//onContract
app.get('/summaryStatistics/onContract', authenticateAndAuthorize, (req, res) => {
    const onContractSalaries = dataset
        .filter(record => record.on_contract === "true")
        .map(record => parseFloat(record.salary));

    if (onContractSalaries.length === 0) {
        return res.json({ message: 'No records with "on_contract": "true" found.' });
    }

    const mean = calculateMean(onContractSalaries);
    const min = Math.min(...onContractSalaries);
    const max = Math.max(...onContractSalaries);

    res.json({ mean, min, max });
});
//byDepartment
app.get('/summaryStatistics/byDepartment', authenticateAndAuthorize, (req, res) => {
    const departmentStats = {};

    dataset.forEach(record => {
        const department = record.department;
        const salary = parseFloat(record.salary);

        if (!departmentStats[department]) {
            departmentStats[department] = { salaries: [salary] };
        } else {
            departmentStats[department].salaries.push(salary);
        }
    });

    for (const department in departmentStats) {
        const salaries = departmentStats[department].salaries;
        departmentStats[department].mean = calculateMean(salaries);
        departmentStats[department].min = Math.min(...salaries);
        departmentStats[department].max = Math.max(...salaries);

        // Remove the individual salary array to reduce response size
        delete departmentStats[department].salaries;
    }

    res.json(departmentStats);
});
//byDepartmentAndSubDepartment
app.get('/summaryStatistics/byDepartmentAndSubDepartment', authenticateAndAuthorize, (req, res) => {
    const departmentSubDeptStats = {};

    dataset.forEach(record => {
        const department = record.department;
        const subDepartment = record.sub_department;
        const salary = parseFloat(record.salary);

        const key = `${department}_${subDepartment}`;

        if (!departmentSubDeptStats[key]) {
            departmentSubDeptStats[key] = { salaries: [salary] };
        } else {
            departmentSubDeptStats[key].salaries.push(salary);
        }
    });

    for (const key in departmentSubDeptStats) {
        const salaries = departmentSubDeptStats[key].salaries;
        departmentSubDeptStats[key].mean = calculateMean(salaries);
        departmentSubDeptStats[key].min = Math.min(...salaries);
        departmentSubDeptStats[key].max = Math.max(...salaries);

        // Remove the individual salary array to reduce response size
        delete departmentSubDeptStats[key].salaries;
    }

    res.json(departmentSubDeptStats);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


