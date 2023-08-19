import org.junit.Test;
import static org.junit.Assert.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ExpenseServerTest {

    @Test
    public void testApiEndpoint() throws IOException, InterruptedException {

        HttpClient client = HttpClient.newHttpClient();

        // Set up the request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8081/apiendpoint"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        // Send the request and get the response
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // check the response status code and message, kf there is error we get test failed
        assertEquals(200, response.statusCode());
        assertEquals("Data received and processed successfully!", response.body());
    }
}
