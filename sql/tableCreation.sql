CREATE TABLE RateTypes(
	rateType VARCHAR(30) NOT NULL,
    PRIMARY KEY(rateType)
);

CREATE TABLE LDC(
	id INT NOT NULL AUTO_INCREMENT,
    companyName VARCHAR(30),
    country VARCHAR(30),
    city VARCHAR(30),
    rateType VARCHAR(30) NOT NULL,
    PRIMARY KEY(id),
	FOREIGN KEY (rateType)
		REFERENCES RateTypes(rateType)
);

CREATE TABLE Rates(
	LDCid INT NOT NULL,
    rateDate date NOT NULL,
    rateType VARCHAR(30) NOT NULL,
    units VARCHAR(10) NOT NULL,
    rateAmount DOUBLE NOT NULL,
    
    PRIMARY KEY(LDCid,rateDate),
    FOREIGN KEY(LDCid)
		REFERENCES LDC(id),
	FOREIGN KEY(rateType)
		REFERENCES RateTypes(rateType)
);

CREATE TABLE Tiered(
	LDCid INT NOT NULL,
    consumptionDate date NOT NULL,
    cosumptionLevel INT NOT NULL,
    upperBoundDemand DOUBLE,
    lowerBoundDemand DOUBLE,
    units VARCHAR(10) NOT NULL,
    rateAmount DOUBLE NOT NULL,
    
    PRIMARY KEY(LDCid,consumptionDate),
    FOREIGN KEY(LDCid)
		REFERENCES LDC(id)
);

CREATE TABLE TimeOfUse(
	LDCid INT NOT NULL,
    consumptionDate date NOT NULL,
    timeOfDay VARCHAR(30) NOT NULL,
    upperBoundDemand DOUBLE,
    lowerBoundDemand DOUBLE,
    units VARCHAR(10) NOT NULL,
    rateAmount DOUBLE NOT NULL,
    
    PRIMARY KEY(LDCid,consumptionDate),
    FOREIGN KEY(LDCid)
		REFERENCES LDC(id)
);


    
