package edu.brown.cs.student.main;

import java.io.PrintWriter;
import java.io.StringWriter;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import org.json.JSONObject;
import spark.*;
import java.util.List;

/**
 * The Main class of our project. This is where execution begins.
 *
 */
public final class Main {


  private static final int DEFAULT_PORT = 4567;

  /**
   * The initial method called when execution begins.
   *
   * @param args
   *             An array of command line arguments
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  private String[] args;

  private Main(String[] args) {
    this.args = args;
  }

  private void run() {
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    parser.accepts("port").withRequiredArg().ofType(Integer.class)
        .defaultsTo(DEFAULT_PORT);

    OptionSet options = parser.parse(args);
    if (options.has("gui")) {
      runSparkServer((int) options.valueOf("port"));
    }
  }

  private void runSparkServer(int port) {
    Spark.port(port);
    Spark.exception(Exception.class, new ExceptionPrinter());
    Spark.options("/*", (request, response) -> {
      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }
      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");

      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }
      Spark.post("/matches", new ResultsHandler());
      return "OK";
    });
    Spark.before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
  }

  /**
   * Display an error page when an exception occurs in the server.
   */
  private static class ExceptionPrinter implements ExceptionHandler {
    @Override
    public void handle(Exception e, Request req, Response res) {
      res.status(500);
      StringWriter stacktrace = new StringWriter();
      try (PrintWriter pw = new PrintWriter(stacktrace)) {
        pw.println("<pre>");
        e.printStackTrace(pw);
        pw.println("</pre>");
      }
      res.body(stacktrace.toString());
    }
  }

  /**
   * Handles requests for horoscope matching on an input
   *
   * @return GSON which contains the result of MatchMaker.makeMatches
   */
  private static class ResultsHandler implements Route {
    @Override
    public String handle(Request req, Response res) {
      try {
        JSONObject re = new JSONObject(req.body());
        String sun = re.getString("sun");
        String moon = re.getString("moon");
        String rising = re.getString("rising");
        List<String> matches = MatchMaker.makeMatches(sun, moon, rising);
        ImmutableMap<String, List<String>> iMap = ImmutableMap.of("matches", matches);
        Gson GSON = new Gson();
        return GSON.toJson(iMap);
      }
      catch(Exception e){
        e.printStackTrace();
      }
      return null;
    }
  }
}