# Project of Data Visualization (COM-480)

# Swiss Pendulum

| Student's name | SCIPER |
| -------------- | ------ |
| Romain Lattion | 347395 |
| Jadd-Ilyes Ali Larbi | 327250 |
| Corentin Barut | 329702 |


[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (21st March, 5pm)

Switzerland’s daily commuters form the backbone of its mobility system, navigating a landscape of efficient trains, winding alpine roads, and bustling urban hubs. Using Swiss Federal Statistical Office (OFS) data, our project visualizes these flows, exploring how geography, transport modes, and time shape commuting patterns.

### Datasets

We chose OFS datasets because they are collected in Switzerland, offering the most comprehensive and trustworthy data on our topic, and are freely accessible. Currently, we mainly rely on three complementary datasets:


- Dataset on the number of commuters per canton (2010-2023). Check [here](data-vizviz/datasets/Commuters_per_canton.xlsx).
- Dataset on commuters' means of transport (1990 + 2000 + 2010-2023).. Check [here](data-vizviz//datasets/Commuters_means_of_transport.xlsx).
- Dataset on commuters' travel distance and time (1990 + 2000 + 2010-2023). Check [here](data-vizviz//datasets/Commuters_travel_time_distance.xlsx).

We’re also keen to explore additional datasets to enrich our visualizations with correlated insights. Below are potential datasets that could enhance our work:
  
- Dataset on the proportion of commuters and their types of journeys (2018-2023). Check [here](/datasets/Commuters_overview.xlsx).
- Dataset on commuters by municipality of residence and municipality of place of work (2010 + 2014 + 2018). Check [here](/datasets/Commuters_communes.xlsx).

The data quality is generally good, as it originates from an official source. However, we need to:
1.	Harmonize the names of municipalities (some have merged over the years).
2.	Check for any duplicates or missing values.
3.	Consolidate the different years into coherent structures for comparison.
Although the dataset is quite large, it is still suitable for interactive visualizations. We plan to display the flows on a map and use “dynamic bar charts” (or “race charts”) to show how the number of journeys or distances evolve over time in various cantons and municipalities.


### Problematic

Our visualization project examines Swiss commuter mobility, focusing on how commuters move across cantons, their transport choices, and travel patterns over time. The main axis is to map commuter flows, mode preferences (car vs. public transport), and regional disparities (urban vs. alpine).

There are three key points of interest:
1.	A global understanding of trends (national-level evolution).
2.	Regional comparisons (differences between cantons and municipalities).
3.	Impact on public policies: transport infrastructure, urban planning, etc.
Our target audience includes researchers (in urban planning and mobility), public decision-makers (territorial development), and anyone curious to see in a simple and interactive way how Swiss residents commute to work. The strength of this project lies in the ability to animate and contextualize these data over time, rather than simply showing static maps or tables.


### Exploratory Data Analysis

We conducted initial research and plotting to explore the dataset’s scope and potential applications.

<p align="center">
  <figure>
    <img src="data-vizviz/img/pendulaire_2_pie_chart.png" width="50%" alt="" />
    <figcaption>Breakdown of means of transport to work in 2023 </figcaption>
  </figure>
</p>

<p align="center">
  <figure>
    <img src="data-vizviz/img/pendulaire_4_histogramme.jpg" width="50%" alt="" />
    <figcaption>Total number of commuters per canton in 2023  </figcaption>
  </figure>
</p>

### Related work

OFS commuter data has been used in reports like "Mobility in Switzerland" (bfs.admin.ch), with static tables on mode shares or canton flows. 

Our approach is original by transforming OFS stats into dynamic visuals, interactive flow maps and time-series emphasizing where and how pendulaires move, not just counts. Unlike OFS’s text-heavy outputs, we’ll animate commuter streams (e.g., Zurich-Bern) and highlight geographic quirks (alpine vs. urban).

What sets our approach apart:
1.	A unified dataset that brings all this information together, making it easier to visualize than other sources.
2.	A “race chart” that shows chronological evolution (for instance, the top 10 cantons with the highest commuter flow and how they “compete” over time).
3.	An interactive map that not only offers geographical visualization but also allows filtering (by canton or focusing on specific years).
4.	A consolidation of different indicators (number of journeys, distance, time, mode of transport) in a single tool, providing a comprehensive and comparative view.
We draw inspiration from the popular “bar chart races” on the internet (for example, those illustrating the changing valuations of companies over time) and from interactive maps built with Leaflet or Mapbox. These approaches are well-suited to the temporal depth of our dataset and will help highlight the diverse situations in different cantons.

<p align="center">
  <figure>
    <img src="data-vizviz/img/Original-Map.png" width="50%" alt="" />
    <figcaption><a href="https://www.esri.com/arcgis-blog/products/arcgis-online/data-management/pump-up-your-pop-ups-with-arcade-and-the-living-atlas/">Example of map and pop up window. Source: esri</a></figcaption>
  </figure>
</p>

<p align="center">
  <figure>
    <img src="data-vizviz/img/demo_15121_none-7.png" width="50%" alt="" />
    <figcaption><a href="https://www.amcharts.com/demos/bar-chart-race/">Example of bar race chart. Source: AMcharts</a></figcaption>
  </figure>
</p>

<p align="center">
  <figure>
    <img src="data-vizviz/img/map_suisse_example.jpg" width="50%" alt="" />
    <figcaption><a href="https://www.atlas.bfs.admin.ch/maps/13/fr/17867_17864_3134_3114/27632.html">Example of a Canton divided Swiss map. Source: BFS</a></figcaption>
  </figure>
</p>
