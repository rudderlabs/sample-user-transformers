# RudderStack User Transformations

RudderStack gives you the ability to code custom JavaScript functions to implement specific use-cases on your event data, like:

* Filtering and/or sampling events.
* Enriching events by implementing static logic or by leveraging an external API.
* Cleaning data by removing unnecessary bits.
* Data masking or removing sensitive PII information in the events to ensure data privacy.
* Data aggregation / rolling-up at a micro-batch level.
* Implementing external actions on the events in the stream using an API.

>**For more information on the RudderStack User Transformations, check out the [documentation](https://docs.rudderstack.com/adding-a-new-user-transformation-in-rudderstack)**.
-----

This repository contains some useful transformation templates that you can use to create your own user transformations.

## User Transformations Workflow

A user transformation:

- Accepts a JSON payload - essentially an array of event objects - formatted as per the canonical object model supported by RudderStack.
- Performs the user-defined function, e.g. event removal/sampling, value substitution or aggregation on the input array.
- Emits the modified payload.

## Get Started

The sample user transformations included in this repository can be added via the RudderStack dashboard.

Adding a new user-defined transformation function is quite simple:
- Log into the [**RudderStack dashboard**](https://app.rudderstack.com/)
- Click on the [**Transformations**](https://app.rudderstack.com/transformations) link.
- Click on the **CREATE NEW** button, assign a name to the transformation, and add the transformation code within the `transformEvent` function.

>For detailed steps on adding a new user transformation, check out the [**documentation**](https://docs.rudderstack.com/getting-started/adding-a-new-user-transformation-in-rudderstack).
-----


## Sample User Transformations 


The following user transformations are included in this repository, which you can use as-is, or tweak them as per your requirement:

### **User Transformation for PII Detection and Masking**
- Implements a masked representation of developer-specified attributes

### **User Transformation for Selective Event Inclusion**
- Selectively includes events

### **User Transformation for Selective Event Removal**
- Selectively removes events

### **User Transformation for Value Aggregation**
- Replaces multiple instances of specific event-type with a single instance containing the aggregated attributes

### **User Transformation for Missing Value Substitution and Batch Size Reduction or Sampling**
- Replaces missing values for an attribute and reduce overall batch size by sampling events

### **User Transformation for Removing Attributes without Values**
- Reduces payload size and optimize storage space for data warehouses

### **User Transformation for Filtering by User E-Mail Domain, Name Splitting, Campaign Parameter Extraction**
- Filters out events triggered by users whose email addresses are from a particular domain
- Splits the full name of a user into first name and last name
- In case of web events, extracts the UTM information from the URL and populate the appropriate keys of the canonical object model

### **User Transformation for Data Enrichment using Clearbit APIs**
- Enriches the user data by invoking Clearbit APIs and embedding the results within events

### **User Transformation for Enriching Events with Location Information Using IP2Location**
- Enriches the event data by invoking the IP2Location API and adding location information to the event

### **User Transformation for Adding Device, OS and Browser Info to an Event**
- Extracts the client-side device, OS and browser names and versions by parsing a User-Agent string present in the event payload
- Adds the information as JSON structure to the event payload

### **User Transformation for Converting Event Type**
- Converts event type from `track` to `identify` based on property values. Can be used as a template for conversion between other event types as well

>**Note**: For a detailed description of each of the user transformations included in this repository, refer to the [**wiki**](https://github.com/rudderlabs/sample-user-transformers/wiki/Sample-User-Transformations) page.
------

## About RudderStack

[**RudderStack**](https://rudderstack.com/) is a customer data platform for developers.  Our tooling makes it easy to deploy pipelines that collect customer data from every app, website and SaaS platform, then activate it in your warehouse and business tools.

To know more about RudderStack, visit our [**website**](https://rudderstack.com/) or check our [**GitHub**](https://github.com/rudderlabs) repository. Make sure you also check out the [**HackerNews discussion**](https://news.ycombinator.com/item?id=21081756) around RudderStack!

## Contribute

Check the [**contributing guide**](https://github.com/rudderlabs/rudder-server/blob/master/CONTRIBUTING.md) to get more information on how you can contribute to this project. If you have any ideas on developing your own custom transformation functions and want some more inputs or thoughts on them, you can talk to us on our [**Slack**](https://resources.rudderstack.com/join-rudderstack-slack) channel.
