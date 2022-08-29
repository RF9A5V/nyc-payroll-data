fetch("https://data.cityofnewyork.us/resource/k397-673e.json?$order=base_salary DESC&$where=fiscal_year = 2021").then(data => {
    return data.json()
}).then(renderPayroll).catch(err => {
    console.log(err)
})

function normalizeText(text) {
    return text.replace(/[^A-z0-9\s]/gi, "").replaceAll(" ", "-").toLowerCase()
}

function renderPayroll(payrollItems) {
    const agencies = {};
    const payrollContainer = document.querySelector(".payroll");

    for(let item of payrollItems) {
        // Get the unique agencies
        agencies[item.agency_name] = agencies[item.agency_name] + 1 || 1;

        // Create the container for our payroll element
        const renderedItem = document.createElement("div");
        renderedItem.classList.add("payroll-item");

        // Display the full name of the person
        const p = document.createElement("p");
        p.textContent = `${item.first_name} ${item.last_name}`;

        // Display the person's base salary
        const p2 = document.createElement("p");
        p2.textContent = `$${item.base_salary}`;

        // Add a CSS class to the person based on their agency
        const agencyNormalized = normalizeText(item.agency_name);
        renderedItem.classList.add(agencyNormalized);

        // Show their position at the agency
        const agencyText = document.createElement("p");
        agencyText.textContent = item.title_description;

        renderedItem.append(p, p2, agencyText);
        payrollContainer.append(renderedItem);
    }

    const selector = document.createElement("select");

    const emptyOption = document.createElement("option");
    emptyOption.innerText = "--- Select an Agency ---";
    // emptyOption.setAttribute("disabled", true);
    emptyOption.setAttribute("value", "");
    selector.append(emptyOption);

    for(let key in agencies) {
        const option = document.createElement("option");
        option.setAttribute("value", normalizeText(key));
        option.innerText = `${key} (${agencies[key]})`;
        selector.append(option);
    }

    selector.setAttribute("value", "");
    document.body.prepend(selector);

    selector.addEventListener("change", (event) => {
        document.querySelectorAll(".payroll-item").forEach(item => {
            item.style.display = "none";
        })

        const target = event.target.value || "payroll-item";

        document.querySelectorAll(`.${target}`).forEach(item => {
            item.style.display = "block";
        })
        
    })
}