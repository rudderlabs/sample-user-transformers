## Performance Tests for RudderStack User Transformations

This directory consists of sample performance test code for some Rudderstack User Transformations

## Get Started
- Install Rudderstack on Kubernetes following instructions provided [here](https://github.com/rudderlabs/rudderstack-helm)

- Type command `kubectl get pods --all-namespaces`. Find name of Rudder Transformer pod from the output. Let's assume that the pod name is `my-release-rudderstack-transformer-d9ff4d765-v72pf` for the sake of next commands

- Login to the Transformer pod with command `kubectl exec --stdin --tty my-release-rudderstack-transformer-d9ff4d765-v72pf -- /bin/sh`

- Create a test directory within the pod `cd /home/node/ && mkdir perf_test`

- Copy test script and test input JSON file to the directory created in above step 
	-	`kubectl cp user_transform_perf_test.js my-release-rudderstack-transformer-d9ff4d765-v72pf:/home/node/perf_test/` 
	-	`kubectl cp user_transform_perf_test_input.json my-release-rudderstack-transformer-d9ff4d765-v72pf:/home/node/perf_test/`

- Login to the pod again, navigate to the test directory and execute tests 
	- `node user_transform_perf_test.js`
