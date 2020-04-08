# What is Rudder?

**Short answer:** 
Rudder is an open-source Segment alternative written in Go, built for the enterprise.

**Long answer:** 
Rudder is a platform for collecting, storing and routing customer event data to dozens of tools. Rudder is open-source, can run in your cloud environment (AWS, GCP, Azure or even your data-centre) and provides a powerful transformation framework to process your event data on the fly.

Released under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## About this repository

This repository contains code for sample user transformations that can be added via the Rudder Configuration Plane

Following are some of the transformations available

* Template User Transformation for PII Detection and Masking

This is a sample/template user transformation wherein a fuzzy search is performed for a list of developer-supplied attribute names
and values of matching attributes are replaced with Xs or a masked representation of the developer's choice

* Template User Transformation for Selective Event Removal and Value Aggregation

	* Selectively remove events based on name match

	* Selectively remove events based on value of an attribute

	* Aggregate values of certain attributes for multiple instances of a specific type of event in a batch and then replace
	  the multiple instances with a single instance containing the aggregated attributes
	  

* Template User Transformation for Missing Value Substitution and Batch Size Reduction or Sampling
	
	* Replace missing values for User-Agent attribute
	
	* In cases where developer has populated cricual attributes within nested structures but not at the root level, copy
	  the values to root level
	  
	* Reduce batch size by first shuffling the events to try and achieve even distribution of event types and then select
	  only a subset of events


