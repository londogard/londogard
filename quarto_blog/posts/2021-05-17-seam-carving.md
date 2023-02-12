---
description: "Seam Carving is the task to remove empty room in a image. Have you ever wished to do 'Content Aware Scaling'? Learn it now!"
tags: [presentation, jvm, kotlin, workshop]
title: "Seam Carving (Presentation & Workshop)"
date: "2021-05-17"
authors: Hampus Londögård
---

This is from a presentation I did last week (12th of May 2021). Notebook just under the slides!  
Please note that this requires the Kotlin kernel to run as it's Kotlin and **not Python**.
<!--truncate-->

<embed src="/assets/Seam_Carving.pdf" width="100%" height="400px" type="application/pdf"/>


```kotlin
@file:DependsOn("org.boofcv:boofcv-core:0.37")
@file:DependsOn("org.boofcv:boofcv-kotlin:0.37")
%use lib-ext
```


```kotlin
import boofcv.abst.filter.derivative.ImageGradient_SB
import boofcv.kotlin.*
import boofcv.alg.feature.detect.edge.GGradientToEdgeFeatures
import boofcv.factory.feature.detect.edge.FactoryEdgeDetectors
import boofcv.io.image.ConvertBufferedImage
import boofcv.struct.image.*
import boofcv.io.image.UtilImageIO
import java.io.*
import javax.imageio.ImageIO
import java.nio.file.*
import java.awt.image.BufferedImage
```


```kotlin
val sobel: ImageGradient_SB.Sobel<GrayF32, GrayF32> by lazy {
        ImageGradient_SB.Sobel(GrayF32::class.java, GrayF32::class.java)
}

fun BufferedImage.toByteArray(format: String): ByteArray {
            val stream = ByteArrayOutputStream()
            ImageIO.write(this, format, stream)
            return stream.toByteArray()
}
fun FloatArray.removeIndices(toRemove: Set<Int>): FloatArray {
        val result = FloatArray(size - toRemove.size)
        var targetIndex = 0
        for (sourceIndex in indices) {
            if (sourceIndex !in toRemove) result[targetIndex++] = this[sourceIndex]
        }
        return result
    }
fun ByteArray.removeIndices(toRemove: Set<Int>): ByteArray {
    val result = ByteArray(size - toRemove.size)
    var targetIndex = 0
    for (sourceIndex in indices) {
        if (sourceIndex !in toRemove) result[targetIndex++] = this[sourceIndex]
    }
    return result
}
```

## Loading an Image with BoofCV
Let's load our first image using BoofCV. It's simply done using `UtilImageIO.loadImage("path/to/file")`.  
The conversion to show an image in a notebook is a little awkward.  

**But** I talked to Jetbrains through Slack - had a response & patch up within 20 minutes (waiting for the new release right now...) which simplifies this!


```kotlin
val img = UtilImageIO.loadImage("dali.jpg")
Image(img.toByteArray("jpg"), "jpg").withWidth("45%")
```

![Salvador Dali Painting](https://user-images.githubusercontent.com/7490199/218312158-6930b301-72e3-4d60-b374-91d29689c8b1.png)


## Sobel Filters
Sobel is a very simple Edge Detector that runs the gradient in two directions  
![sobel](https://homepages.inf.ed.ac.uk/rbf/HIPR2/figs/sobmasks.gif)  


![image](https://user-images.githubusercontent.com/7490199/118540315-c5478f00-b750-11eb-9130-49aa13cacd9e.png)
![image](https://user-images.githubusercontent.com/7490199/118540425-ddb7a980-b750-11eb-85c9-cba16b218241.png)
(18.S191 MIT Fall 2020 | Grant Sanderson)
By applying this filter


```kotlin
val grayImg = img.asGrayF32()
Image(grayImg.asBufferedImage().toByteArray("jpg"), "jpg").withWidth("45%")
```

![S. Dali Painting Gray](https://user-images.githubusercontent.com/7490199/218312209-9a4bbd92-dd39-4b2a-ac8f-fd2f084257e2.png)


```kotlin
val grayDY = GrayF32(1,1)
val grayDX = GrayF32(1,1)
sobel.process(grayImg, grayDX, grayDY)
DISPLAY(Image(grayDY.asBufferedImage().toByteArray("jpg"), "jpg").withWidth(500))
Image(grayDX.asBufferedImage().toByteArray("jpg"), "jpg").withWidth(500)
```

![Edges Up & Down (dY)](https://user-images.githubusercontent.com/7490199/218312358-335dfd80-56c2-497b-8210-73ef4eeacdbd.png)
![Edges Left & Right (dX)](https://user-images.githubusercontent.com/7490199/218312465-8b015060-ae41-4706-b725-e0bfb9293f22.png)


Now we need to combine these two into one image, that's done by taking the intensity, e.g.

$\sqrt{D_x^2 + D_y^2}$

Also called `l2-norm`, `euclidean-norm` or `square-norm`.

Where $D_x$ is the gradient in X direction (applying sobel-filter).

Luckily this exists in BoofCV (and most libraries), in the way of `GGradientToEdgeFeatures.intensityE(grayDX, grayDY, intensity)`


```kotlin
val intensity = GrayF32(1,1)
GGradientToEdgeFeatures.intensityE(grayDX, grayDY, intensity)
Image(intensity.asBufferedImage().toByteArray("jpg"), "jpg").withWidth("75%")
```


![Painting Edges by Filter](https://user-images.githubusercontent.com/7490199/218312648-b444c095-d214-42b5-b4ad-9b77c202f86c.png)




With the edges at hands (white) we can go ahead and try to **create a graph of total intensity**.  
It is this graph we'll use to traverse later, to find the cheapest path.

So how would we do this?   
Trying all paths would prove expensive, but if we traverse the reverse we can speed things up by being clever.

Let's take a look at how a **subimage** of the image looks.


```kotlin
intensity.subimage(10,10,20,20).printInt()
```

      5   9   2   7   6   6   4   4   5   6 
      3   7   4   7   4   3   3   7   3   5 
      9   7   5   6   6   1   5   5   3   6 
     10   6   7   4   4   4   5   4   6   3 
      7   7   6   4   5   2   5   8   5   2 
      4   3   2   2   3   1   3  11   3   1 
      3   1   7   6   3   3   4   9   4   2 
      3   5   4   4   7   7   1   6   6   5 
     10   6   1   4   3   8   4   6   7  10 
      4   7   3   3   4   5   6   7   7  10 


And now we'll take a look at how this traversal works. These screens are taken from (18.S191 MIT Fall 2020 | Grant Sanderson) which is really good by the way.

![image](https://user-images.githubusercontent.com/7490199/118539877-3fc3df00-b750-11eb-881a-49613e6e72bd.png)
![image](https://user-images.githubusercontent.com/7490199/118539905-46525680-b750-11eb-8481-d7150e2890ec.png)
![image](https://user-images.githubusercontent.com/7490199/118539926-4d796480-b750-11eb-93a6-c126a51891dc.png)
![image](https://user-images.githubusercontent.com/7490199/118539935-536f4580-b750-11eb-9306-e30ac5226b21.png)
![image](https://user-images.githubusercontent.com/7490199/118539952-5a965380-b750-11eb-9852-d103b2e1f0a2.png)

```kotlin
val tmp = intensity.clone()
val width = tmp.width
val height = tmp.height

(height - 2 downTo 0).forEach { y ->
    (0 until width).forEach { x -> 
        val range = (max(0, x-1)..min(x+1, width - 1))
        val minimum = range.minOf { x2 -> tmp[x2, y + 1] }
        tmp[x,y] += minimum
    }
}

val max = (tmp.data.maxOrNull() ?: 0f) / 255f
tmp.data.forEachIndexed { i, _ -> tmp.data[i] /= max }
```


```kotlin
Image(tmp.asBufferedImage().toByteArray("jpg"), "jpg").withWidth("50%")
```

![Edges Delta](https://user-images.githubusercontent.com/7490199/218312759-b6cd8a29-f1ed-4471-a440-f04c70031d44.png)

Through this image we can find the cheapest path by traversing the darkest path, where white is "expensive".

This is simply done by taking the cheapest value at each row, forming a line. We've precalculated the whole matrix making this a walk in the park.



```kotlin
var previousX = 0 //int[]
val cheapestPath = IntArray(height) { y ->
    val range = when(y) {
        0 -> 0 until width
        else -> (max(previousX - 1, 0)..min(previousX + 1, width - 1))
    }
    previousX = range.minByOrNull { x -> tmp[x,y] } ?: previousX
    
    previousX + (y * width)
}
cheapestPath.take(10)
```




    [1022, 2222, 3421, 4621, 5821, 7022, 8223, 9422, 10622, 11821]




```kotlin
val WHITE = 255f
cheapestPath.forEach { i -> grayImg.data[i] = WHITE }
Image(grayImg.asBufferedImage().toByteArray("jpg"), "jpg").withWidth("75%")
```

![The Best Seam to Remove](https://user-images.githubusercontent.com/7490199/218313375-eab8f208-e552-435c-988a-a60015d2f141.png)

```kotlin
fun cheapestPath(image: GrayF32): Set<Int> {
        val widthRange = 0 until image.width
        for (y in image.height - 2 downTo 0) {
            for (x in widthRange) {
                val range = when (x) {
                    0 -> 0..1
                    widthRange.last -> x-1..x
                    else -> x-1..x+1
                }
                val cheapestPath = range.minOf { i -> image[i, y + 1] }

                image[x, y] = image[x, y] + cheapestPath
            }
        }

        var previousBest = 0
        return IntArray(image.height) { i ->
            val range =
                if (i == 0) 0 until image.width
                else max(previousBest - 1, 0)..min(previousBest + 1, image.width - 1)
            previousBest = range.minByOrNull { j -> image.get(j, i) } ?: 0

            previousBest + (i * image.width) // Raw Index
        }.toSet()
}

fun seamCarve(img: GrayF32): Set<Int> {
        sobel.process(img, grayDX, grayDY)
        GGradientToEdgeFeatures.intensityE(grayDX, grayDY, intensity)
        return cheapestPath(intensity)
}
```


```kotlin
val grayImg = img.asGrayF32()
(0..200).forEach { i ->
    val indices = seamCarve(grayImg)
    
    if (i % 25 == 0) {
        indices.forEach { j -> grayImg.data[j] = WHITE }
        UtilImageIO.saveImage(grayImg.asBufferedImage(), "step_$i.jpg")
    }
    grayImg.apply {
        setData(grayImg.data.removeIndices(indices))
        reshape(width - 1, height)
    }
}
```


```kotlin
DISPLAY(Image("step_0.jpg"))
Image("step_200.jpg")
```

![image](https://user-images.githubusercontent.com/7490199/118542607-836c1800-b753-11eb-8677-b98ad12ba069.png)
![image](https://user-images.githubusercontent.com/7490199/118542621-89fa8f80-b753-11eb-98ee-274b0ea03c7c.png)
