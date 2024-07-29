import {  MainCategory, SkillSet, Subcategory, TechnologyItem } from "../models/ClientsModel";

type Technologies = {
    [mainCategory: string]: {
        [subCategory: string]: string[];
    };
};

const technologies: Technologies = {
    'Development Technologies': {
        "Web": ['HTML5', 'CSS3', 'JavaScript', 'AngularJS'],
        "Mobile": ['Android', 'iOS', 'Xamarin'],
        '.NET': ['C#', 'ASP.NET', 'Entity Framework'],
        "J2EE": ['Java', 'Spring', 'Hibernate'],
        "LAMP": ['Linux', 'Apache', 'MySQL', 'PHP'],
    },
    'Data Management and Analytics': {
        "Database": ['Microsoft SQL Server', 'Oracle', 'SQLite', 'PL/SQL'],
        'Big Data': ['Hadoop', 'MongoDB'],
        "Analytics": ['Power BI', 'SSRS', 'Google Analytics'],
    },
    'Platforms and Systems': {
        "ERP": ['Microsoft Navison', 'SAP'],
        "CRM": ['Microsoft Dynamics CRM'],
        "CMS": ['Dot Net DNN', 'WordPress', 'Alfresco', 'Drupal', 'Joomla'],
        'Cloud Platforms': ['Azure', 'Amazon', 'AWS'],
    },
    'Architecture and Design': {
        "Architecture": ['Enterprise Architect', 'Rational Software Architect', 'No Magic', 'Modelio', 'Archi'],
        "UIDesigning": ['Infragistics', 'Telerik'],
    },
    'Business Solutions': {
        "eCommerce": ['Magento', 'VevoCart', 'Shopify'],
        'Enterprise Social': ['Microsoft Yammer'],
    },
    'Quality Assurance and Project Management': {
        "Testing": ['JMeter', 'JUnit', 'Mercury', 'Selenium', 'Regression Testing'],
        'Project Management': ['MS Project', 'SmartSheet'],
    },
};



export function convertRawItemsToBackendStructure(
    predefinedRawItems: { [key: string]: number },
    customTechsData:TechnologyItem[]
): SkillSet {
    const predefinedTechData: MainCategory[] = [];

    for (const [mainCategory, subcategories] of Object.entries(technologies)) {
        const subcategoryList: Subcategory[] = [];

        for (const [subcategory, techNames] of Object.entries(subcategories)) {
            const items: TechnologyItem[] = [];

            for (const techName of techNames) {
                if (predefinedRawItems[techName] !== undefined) {
                    const singleItem:TechnologyItem={
                        techName: techName,
                        quantity:predefinedRawItems[techName]
                    }
                    items.push(singleItem)
                }
            }

            if (Object.keys(items).length > 0) {
                subcategoryList.push({ subcategory, items });
            }
        }

        if (subcategoryList.length > 0) {
            predefinedTechData.push({ mainCategory, subcategories: subcategoryList });
        }
    }

    return {
        predefinedTechData,
        customTechsData
    };
}