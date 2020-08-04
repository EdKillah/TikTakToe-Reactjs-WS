package edu.escuelaing.springboot.app.endpoints;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.logging.Level;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Logger;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import edu.escuelaing.springboot.app.repositories.TicketRepository;

@Component
@ServerEndpoint("/TTTService")
public class TTTEndPoint {

	private static final Logger logger = Logger.getLogger(TTTEndPoint.class.getName());
	/* Queue for all open WebSocket sessions */
	static Integer idRoom = 0;
	static Queue<Session> queue = new ConcurrentLinkedQueue<>();
	static HashMap<Integer, List<Session>> rooms = new HashMap<Integer, List<Session>>();

	private boolean accepted = true; // Para que sirve el acepted?

	// TicketRepository ticket = TicketRepository.getInstance();

	Session ownSession = null;

	/* Call this method to send a message to all clients */
	public void send(String msg, Session sesiion) {

		rooms.forEach((k, v) -> {
			System.out.println("Key: " + k + ": Value: " + v);
			if (v.contains(sesiion)) {
				System.out.println("Es capaz de entrar: " + v);
				v.forEach(x -> {
					System.out.println("Valores de session match: " + x);
					try {
						x.getBasicRemote().sendText(msg);
						System.out.println("Envio correctamente el mensaje!");
					} catch (IOException e) {
						logger.log(Level.INFO, e.toString());
						e.printStackTrace();
					}
				});
			}
		});

	}

	@OnMessage
	public void processPoint(String message, Session session) {
				

		if (accepted) { // Este acepted sobra. no estamos validando seguridad
			System.out.println("Message received:" + message + ". From session: " + session);
			JSONObject mensaje = new JSONObject(message);
			System.out.println("JSON: " + mensaje);
			this.send(message, session);
		} else if (!accepted) { // && ticket.checkTicket(message)
			accepted = true;
		}
	}

	@OnOpen
	public void openConnection(Session session) {
		/* Register this connection in the queue */
		queue.add(session);
		ownSession = session;
		logger.log(Level.INFO, "Connection opened.");		
		idRoom++;
		if (idRoom % 2 == 0) {
			List<Session> toBeMatched = new ArrayList<Session>();
			toBeMatched.add(queue.remove());
			toBeMatched.add(queue.remove());
			rooms.put(idRoom / 2, toBeMatched);
		}

		String starterValue;
		try {
			if (queue.size() % 2 == 0) {
				starterValue = "X";
			} else {
				starterValue = "O";
			}
			session.getBasicRemote().sendText("Connection established.");
			session.getBasicRemote().sendText("inicial: " + starterValue);

		} catch (IOException ex) {
			logger.log(Level.SEVERE, null, ex);
		}
	}

	@OnClose
	public void closedConnection(Session session) {
		
		System.out.println("Va a eliminar: " + session);		
		System.out.println(rooms.values());
		Optional<List<Session>> result = rooms.values().stream().filter(e -> e.contains(session)).findFirst();
		
		rooms.values().remove(result.get());

		System.out.println("Without match closed: " + rooms.values());
		
		logger.log(Level.INFO, "Connection closed.");
	}

	@OnError
	public void error(Session session, Throwable t) {
		/* Remove this connection from the queue */
		//queue.remove(session); Como no existe la session en el queue no es necesario esto, puede que falle.
		logger.log(Level.INFO, t.toString());
		logger.log(Level.INFO, "Connection error.");
	}
}