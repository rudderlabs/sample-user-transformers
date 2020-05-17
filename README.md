## User Transformations for RudderStack

RudderStack gives you the ability to code custom user transformation functions to implement use-cases based on your requirements. As these transformations are written in JavaScript, it is very easy for you to integrate them into the RudderStack data pipeline. Some common use cases for these transformations include PII detection and masking, event removal and aggregation, and event enrichment.

This repository contains some useful transformation templates that you can use to create your own user transformations.

### How user transformations work

A user transformation does the following:
- Accepts a JSON payload - which is essentially an array of event objects - formatted as per the canonical object model supported by RudderStack
- Performs the user-defined function such as event removal/sampling, value substitution or aggregation on the input array
- Emits the modified payload

## Get Started
The sample user transformations included in this repository can be added via the RudderStack Configuration Plane.

Adding a new user-defined transformation function is quite simple:
- Log into the [RudderStack dashboard](https://app.rudderstack.com/)
- Click on the [Transformations](https://app.rudderstack.com/transformations) link
- Click on **CREATE NEW**
- Add your code within the `transform` function in the **Transformation** window that comes up. You can add other functions and call them from within `transform`

**For detailed steps on adding a new user transformation, please follow [this documentation](https://docs.rudderstack.com/getting-started/adding-a-new-user-transformation-in-rudderstack)**


**Important**: User Transformations need to have a `transform` method that will take an array of events as argument and return the modified array


**Tip**: You can copy-paste the entire code of any of the functions in this repository into the **Transformation** window. Do remember to delete the pre-populated `transform` function in such cases, before pasting your code.

Here’s a quick visual tutorial on adding a new user transformation:

![Demo for User-defined Functions](Resources/UDF.gif)

The following user transformations are included in this repository, which you can use as-is, or tweak them as per your requirement:

### **User Transformation for PII Detection and Masking**
- Implements a masked representation of developer-specified attributes

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

**Note**: For a detailed description of each of the user transformations included in this repository, please refer to our [wiki](https://github.com/rudderlabs/sample-user-transformers/wiki/Sample-User-Transformations) page.

## License
The RudderStack Server is released under the [AGPLv3 license](https://www.gnu.org/licenses/agpl-3.0-standalone.html).

## What is RudderStack
RudderStack is an open-source customer data infrastructure platform for collecting, storing and routing customer event data to the destinations as specified by you. RudderStack runs on your cloud environment or even your data center and provides a powerful framework to process and route your event data on the fly. 

To know more about RudderStack, please visit our [website](https://rudderstack.com/) or check our [GitHub](https://github.com/rudderlabs) repository. You can also [contact us](https://rudderstack.com/contact/) or join our [Discord](https://discordapp.com/invite/xNEdEGw) channel to know more about the platform, and what we do. Make sure you also check out the [HackerNews discussion](https://news.ycombinator.com/item?id=21081756) around RudderStack!

## Contribute
Please see the [contributing guide](https://github.com/rudderlabs/rudder-server/blob/master/CONTRIBUTING.md) to get more information on how you can contribute to this project. If you have any ideas on developing your own custom transformation functions and want some more inputs or thoughts on them, you can talk to us on our [Discord](https://discordapp.com/invite/xNEdEGw) channel.
