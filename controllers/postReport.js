const fs = require("fs-extra");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { PDFDocument } = require("pdf-lib");

function mapLineItemsToVars(str1, str2) {
    // split items by $
    const items1 = str1.split("$").map(i => i.trim()).filter(Boolean);
    const items2 = str2.split("$").map(i => i.trim()).filter(Boolean);

    // parse each item => { desc, qnt }
    const parsed1 = items1.map(item => {
        const match = item.match(/^(.*) q(\d+)$/i);
        return match ? { desc: match[1].trim(), qnt: match[2] } : { desc: "", qnt: "" };
    });
    const parsed2 = items2.map(item => {
        const match = item.match(/^(.*) q(\d+)$/i);
        return match ? { desc: match[1].trim(), qnt: match[2] } : { desc: "", qnt: "" };
    });

    // Pad to 7 items
    while (parsed1.length < 7) {
        parsed1.push({ desc: "", qnt: "" });
    }
    while (parsed2.length < 7) {
        parsed2.push({ desc: "", qnt: "" });
    }

    const output = {};

    // Assign comp_replacedDesc1..7 & comp_replacedQnt1..7
    parsed1.slice(0, 7).forEach((it, i) => {
        const idx = i + 1;
        output[`comp_replacedDesc${idx}`] = it.desc;
        output[`comp_replacedQnt${idx}`] = it.qnt;
    });

    // Assign comp_need_replaceDesc1..7 & comp_need_replaceQnt1..7
    parsed2.slice(0, 7).forEach((it, i) => {
        const idx = i + 1;
        output[`comp_need_replaceDesc${idx}`] = it.desc;
        output[`comp_need_replaceQnt${idx}`] = it.qnt;
    });

    return output;
}


async function postReport(req, res, next) {
    try {
        // let data = {
        //     crm_id: "CRM-10233213",
        //     received_on: "2025-01-10",
        //     attended_on: "2025-01-12",
        //     cognised_on: "2025-01-13",

        //     customer_name_address: "ABC Industries, Plot 45, Industrial Area, Delhi",
        //     customer_contact_person: "Rohit Kumar",
        //     customer_contact_number: "9876543210",
        //     customer_email_id: "support@abcindustries.com",
        //     customer_website: "https://abcindustries.com",

        //     nature_of_complaints: "UPS not switching to backup",
        //     serial_number: "UPS-SN-884422",
        //     equipment_model: "SmartX-10KVA",
        //     equipment_capic: "10 KVA",
        //     equipment_product: "UPS System",
        //     equipment_configuration: "Online UPS with external batteries",
        //     battery_details: "SMF 12V 9AH x 16",
        //     type_of_faults: "Power supply fault",

        //     complaint_details: "Customer reported UPS not switching to battery mode.",
        //     diagnosis_observation: "Found faulty charging card.",
        //     collective_action_remarks: "Replaced charging card and tested successfully.",

        //     ip_volts_RN: "230",
        //     ip_volts_YN: "231",
        //     ip_volts_BN: "229",

        //     DC_op_vol: "108",
        //     DC_op_amp: "12",

        //     battery_vol: "13.4",
        //     battery_amp: "7.5",

        //     op_volts_RN: "230",
        //     op_volts_YN: "232",
        //     op_volts_BN: "228",

        //     op_amps_R: "3.2",
        //     op_amps_Y: "3.4",
        //     op_amps_B: "3.1",

        //     ipe_vol_PE: "0.5",
        //     ipe_vol_NE: "0.8",

        //     comp_replaced: "Charging card q48$net cart q9",
        //     comp_need_replace: "Charging card q48$net cart q9",

        //     technical_suggestion: "Regular maintenance recommended.",
        //     customer_comment: "UPS running fine after repair.",
        //     contact_name: "Arjun Mehta",
        //     contact_design: "Maintenance Manager",
        //     contact_num: "9988776655",
        //     connected_load: "8 KVA",
        //     eq_is_ok:"1",
        //     eq_n_ok:"0",
        //     CCO:"0",
        //     CC:"0",
        // };

        let data = req.body || "";

        let { comp_replacedDesc1, comp_replacedDesc2, comp_replacedDesc3, comp_replacedDesc4, comp_replacedDesc5, comp_replacedDesc6, comp_replacedDesc7, comp_replacedQnt1, comp_replacedQnt2, comp_replacedQnt3, comp_replacedQnt4, comp_replacedQnt5, comp_replacedQnt6, comp_replacedQnt7, comp_need_replaceDesc1, comp_need_replaceDesc2, comp_need_replaceDesc3, comp_need_replaceDesc4, comp_need_replaceDesc5, comp_need_replaceDesc6, comp_need_replaceDesc7, comp_need_replaceQnt1, comp_need_replaceQnt2, comp_need_replaceQnt3, comp_need_replaceQnt4, comp_need_replaceQnt5, comp_need_replaceQnt6, comp_need_replaceQnt7 } = mapLineItemsToVars(data.comp_replaced, data.comp_need_replace);
// ✅ Flattened object using references only
        const flatData = {
            crm_id: data.crm_id || "",
            received_on: data.received_on || "",
            attended_on: data.attended_on || "",
            cognised_on: data.cognised_on || "",

            customer_name_address: data.customer_name_address || "",
            customer_contact_person: data.customer_contact_person || "",
            customer_contact_number: data.customer_contact_number || "", 
            customer_email_id: data.customer_email_id || "",
            customer_website: data.customer_website || "",

            equipment_nature_of_complaints: data.nature_of_complaints || "",
            equipment_serial_number: data.serial_number || "",
            equipment_model: data.equipment_model || "",
            equipment_capic: data.equipment_capic || "",
            equipment_product: data.equipment_product || "",
            equipment_configuration: data.equipment_configuration || "",
        // equipment_battery_details: data.equipment.battery_details.type + " " + data.equipment.battery_details.quantity,
            equipment_battery_details: data.battery_details || "",
            equipment_type_of_faults: data.type_of_faults || "",

            complaint_details: data.complaint_details || "",
            complaint_diagnosis_observation: data.diagnosis_observation || "",
            complaint_collective_action_remarks: data.collective_action_remarks || "",

            ip_vol_RN: data.ip_volts_RN || "",
            ip_vol_YN: data.ip_volts_YN || "",
            ip_vol_BN: data.ip_volts_BN || "",

            DC_op_vol: data.DC_op_vol || "",
            DC_op_am: data.DC_op_amp || "",

            bat_vol: data.battery_vol || "",
            bat_amp: data.battery_amp || "",

            op_vol_RN: data.op_volts_RN || "",
            op_vol_YN: data.op_volts_YN || "",
            op_vol_BN: data.op_volts_BN || "",

            op_amp_R: data.op_amps_R || "",
            op_amp_Y: data.op_amps_Y || "",
            op_amp_B: data.op_amps_B || "",

            ipe_vol_PE: data.ipe_vol_PE || "",
            ipe_vol_NE: data.ipe_vol_NE || "",

            comp_replacedDesc1,
            comp_replacedDesc2,
            comp_replacedDesc3,
            comp_replacedDesc4,
            comp_replacedDesc5,
            comp_replacedDesc6,
            comp_replacedDesc7,
            
            comp_replacedQnt1,
            comp_replacedQnt2,
            comp_replacedQnt3,
            comp_replacedQnt4,
            comp_replacedQnt5,
            comp_replacedQnt6,
            comp_replacedQnt7,

            comp_need_replaceDesc1,
            comp_need_replaceDesc2,
            comp_need_replaceDesc3,
            comp_need_replaceDesc4,
            comp_need_replaceDesc5,
            comp_need_replaceDesc6,
            comp_need_replaceDesc7,
            
            comp_need_replaceQnt1,
            comp_need_replaceQnt2,
            comp_need_replaceQnt3,
            comp_need_replaceQnt4,
            comp_need_replaceQnt5,
            comp_need_replaceQnt6,
            comp_need_replaceQnt7,

            technical_suggestion: data.technical_suggestion || "",
            customer_comment: data.customer_comment || "",
            customer_sign_seal: data.customer_sign_seal || "",
            contact_name: data.contact_name || "",
            contact_designation: data.contact_design || "",
            contact_number: data.contact_num || "",
            eq_is_ok: data.eq_is_ok || "",
            eq_n_ok: data.eq_n_ok || "",
            CCO: data.CCO || "",
            CC: data.CC || "",
            connected_load: data.connected_load || "",
        };

        console.log('line 202', flatData);

        let PizZip = require('pizzip');
        let Docxtemplater = require('docxtemplater');
        let path = require('path');
        let fs = require('fs');

        function replaceErrors(key, value) {
            if (value instanceof Error) {
                return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                    error[key] = value[key];
                    return error;
                }, {});
            }
            return value;
        }

        function errorHandler(error) {
            console.log(JSON.stringify({
                error: error
            }, replaceErrors));

            if (error.properties && error.properties.errors instanceof Array) {
                const errorMessages = error.properties.errors.map(function (error) {
                    return error.properties.explanation;
                }).join("\n");
                console.log('errorMessages', errorMessages);
                // errorMessages is a humanly readable message looking like this :
                // 'The tag beginning with "foobar" is unopened'
            }
            throw error;
        }

        let file = path.resolve(rootpath + '/templates', 'field_service_report_template.docx');
        let content = fs.readFileSync(file, 'binary');
        let zip = new PizZip(content);
        let doc;
        try {
            doc = new Docxtemplater(zip);
        } catch (error) {
            // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
            errorHandler(error);
        }

        doc.setData(flatData);

        try {
            doc.render()
        } catch (error) {
            errorHandler(error);
        }

        let buf = doc.getZip()
            .generate({
                type: 'nodebuffer'
        });

        let fileName = 'sample_data';
        // let fileName2 = 'report_' + Date.now().toString();
        let fileName2 = 'report_' + 'file';

        fileName = fileName + '.docx';
        // var fileContents = Buffer.from(buf, "base64");

        // res.send(fileContents);
        let filepath = path.resolve(rootpath + '/output/');

        let _tmpFile = path.resolve(filepath, fileName);
        // console.log('line 539',_tmpFile)

        if (!fs.existsSync(_tmpFile)) {
            filepath = path.resolve("/output");
            _tmpFile = path.resolve(filepath, fileName);
            
        }

        let filepathname = _tmpFile;


        fs.stat(filepathname, function (err, stats) {
            // console.log(stats); //here we got all information of file in stats variable

            if (err) {
                return console.error(err);
            }

            fs.unlink(filepathname, function (err) {
                if (err) return console.log(err);
                // console.log('file deleted successfully');
                fs.writeFileSync(filepathname, buf);


                const libre = require('libreoffice-convert');


                const extend = '.pdf'
                var file = fs.readFileSync(path.resolve(filepath, fileName));
                // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
                libre.convert(file, extend, undefined, async (err, done) => {
                    if (err) {
                        console.log(`Error converting file: ${err}`);
                    }
                    var fname = fileName2 + extend;

                    var outputPath = path.resolve(rootpath + '/output/tmp/', fname);
                    // Here in done you have pdf file which you can save or transfer in another stream
                    console.log('line 579', outputPath);
                    fs.writeFileSync(outputPath, done);

                    
                    // let pathFile = "/output/tmp/" + fname;
                    
                    try {

                        let ext = fname.substr(fname.lastIndexOf('.') + 1);
                        let urlLink = "https://tristar-backend.onrender.com" + "/getFile?file=" + fname;

                        let _data = { 'ext': ext, 'url': urlLink };
                        // console.log('line 600', _data);
                        res.json({ "res": "success", data: _data, messg: 'All Set' });

                    
                } catch(error00) {
                        console.log(error00);
                        res.send(error00);
                    }

                });

            });
        });

        // return res.json({
        //     response: "success",
        //     message: "Report generated successfully",
        //     download_link: downloadUrl
        // });

    } catch (error) {
        console.error("Error generating report:", error);
        return res.status(500).json({ response: "error", message: "Failed to generate report" });
    }
}

module.exports = postReport;
