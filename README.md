# Airbean-Individuell examination

## Projekt beskrivning

Airbean är en fiktionell app där man kan beställa kaffe med drönare. Mitt uppdrag var att skapa ett REST-API för att klara av allt denna app behöver i backend. 

- **Som gäst** ska man kunna se menyn och beställa samt få en orderbekräftelse när man har köpt.
- **Som inloggad användare** ska man kunna se tidigare orderhistorik
- **Som inloggad admin** ska man kunna lägga till, ta bort och redigera varorna i menyn

Detta är ett individuellt examinationsprojekt som från grunden var ett gruppprojekt som man sedan tog över för att skapa fler funktioner.

Det är ett nodeprojekt skapat med express.

### Funktioner

Se endpoints nedan tillsammans med instruktioner:

| Anrop       | Endpoints        | Resultat | Instruktioner |
| ------------- | :----------| :-----| ---------------------------------- |
| GET | /about | Om oss | |
| GET | /order | Meny | Här kan du se id på den produkten du vill beställa (det behöver du sedan för att kunna lägga varan i varukorgen) |
| POST | /cart | Lägg i varukorg | I JSON-body ange id på den varan du vill lägga i varukorgen, t.ex: `{"id": "3edc7d79-272d-4634-9a70-c443d884cf59"}` Du får sen ett svar med namnet och priset på varan som lagts till |
| GET | /cart | Se varukorg | Du ser alla varor i varukorgen samt den totala summan |
| DEL | /cart/:id | Ta bort vara från varukorg | Om du vill ta bort en vara anger du id på den produkten som path parameter |
| POST | /order | Beställ | Alla produkter som låg i varukorgen på användaren, en tid för beräknad leveranstid och ett orderId skickas till användaren. Varorna läggs i en order-databas och varukorgen rensas | 
| GET | /order/:orderid | Bekräftelse med leveranstid | Ange orderId som path parameter för att ta fram bekräftelsen med beräknad leveranstid |
| POST | /account/register | Skapa konto | För att skapa ett konto måste du ange ett username och ett password i följande format: `{"username": "dittAnvändarnamn", "password": "dittLösenord"}` notera att det inte går att ange i vilket format som helst, båda parametrar måste anges för att skapa ett konto. Som svar får du ditt användarId |
| POST | /account/login | Logga in | För att logga in anger du username och password i förljande format i JSON-body: `{"username": "dittAnvändarnamn", "password": "dittLösenord"}`. Som svar får du en bekräftelse och login status |
| GET | /account/status | Se loginstatus | Om du behöver kolla om du är inloggad kan du göra det här. Du behöver inte ange något i body eller path parameter |
| GET | /account/order/orders | Orderhistorik | Om du är inloggad kan du se tidigare orderhistorik som sparats på ditt användarid. Du kan se orderid, orderdatum, det totala beloppet och de varor som köpts |
| GET | /account/users/account-details | Se kontodetaljer | Om du är inloggad kan du se dina kontodetaljer här |
| POST | /account/logout | Logga ut + rensa vaukorg | Om du är inloggad och loggar ut rensas även varukorgen |
| POST | /admin/register | Registrera konto som admin | Ange användarnamn och lösenord i följande format i JSON body: `{"username": "dittAnvändarnamn", "password": "dittLösenord"}`, ditt användarId returneras |
| POST | /admin/login | Logga in som admin | Ange användarnamn och lösenord i följande format i JSON body: `{"username": "dittAnvändarnamn", "password": "dittLösenord"}`, du får en bekräftelse på att du är inloggad |
| GET | /admin/status | Se loginstatus som admin | |
| POST | /admin/logout | Logga ut | |
| POST | /admin/create-item | Lägg till vara i menyn | Om du är inloggad som admin kan du lägga till varor här. Ange i följande i JSON format `{"title": "titelPåVaran", "desc": "Beskrivning av varan", "price": 33}` (Notera att priset ska vara i siffror men resterande som strings). Datum när den skapats läggs till. Du får itemId tillbaka som är unikt för den varan. |
| PUT | /admin/:itemId | Ändra vara i menyn | För att ändra en vara anger du **itemId i path parameter**, och i JSON body anger du det du vill ändra och ändringen, om du endast vill ändra titeln skriver du följande: `{"title": "nyTitel"}`. Datum för ändring läggs till. Den redigerade varan returneras till dig. **OBS!** Menyn uppdateras inte förrän servern startats om |
| GET | /admin/:itemId | Se vara i menyn | Om du är inloggad som admin kan du se en vara genom att ange itemId som path parameter |
| DEL | /admin/:itemId | Ta bort vara från menyn | Om du är inloggad som admin kan du ta bort en vara genom att ange itemId som path parameter |
| POST | /admin/special-offers | Skapa erbjudanden | Om du är inloggad som admin kan du välja två varor från menyn och lägga till dessa som ett erbjudande där priset justerats så kunden får 20% rabatt på den kombinationen. Du lägger till dessa i JSON body i följande format: `{"item1": "[id på den vara du vill lägga till]", "item2": "[id på den andra varan du vill lägga till]"` (Notera att det endast går att lägga till två varor)|

## Installation och hur du kör programmet

Gå igenom följande steg för att skapa en lokal kopia och köra det:

1. Clone the repository:
   ```bash
   git clone https://github.com/Mayonesa90/Airbean-Individuell-examination.git

2. Navigate to the project directory:
   ```bash
   cd Airbean-Individuell-examination

3. Install dependencies:
   ```bash
   npm install

4. Start the development server:
   ```bash
   nodemon server.js
