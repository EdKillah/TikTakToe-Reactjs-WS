package edu.escuelaing.springboot.app.repositories;

public class TicketRepository {}
/*
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class TicketRepository {

	private static TicketRepository _instance = new TicketRepository(); 
	
	private final List<String> listaTickets;
	
	private int ticketNumber;
	
	private TicketRepository() {
		listaTickets = new CopyOnWriteArrayList<>();
		ticketNumber = 0;
	}
	
	public static TicketRepository getInstance() {
		return _instance;
	}
	
	public Integer getTicket() {
		Integer a =ticketNumber++;
		listaTickets.add(a.toString());
		return a;
	}
	
	public boolean checkTicket(String ticket) {
		boolean isValid = listaTickets.remove(ticket);
		return isValid;	
	}
	
	public void eviction() {
		//delete tickets 
	}
	
	
}
*/